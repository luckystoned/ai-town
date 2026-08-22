import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { PlayableCharacterId } from '../shared/playableCharacters';
import {
  generateGameCode,
  normalizeGameCode,
  planCharacterSelection,
  planLobbyJoin,
  requireLobbySession,
  requireReconnectPlayer,
  toPublicLobby,
  validateControllerToken,
} from './gameSessionsDomain';

const MAX_CODE_ATTEMPTS = 20;

async function hashToken(token: string) {
  validateControllerToken(token);
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function publicPlayer(player: {
  name: string;
  joinedAt: number;
  characterId?: PlayableCharacterId;
}) {
  return {
    name: player.name,
    joinedAt: player.joinedAt,
    ...(player.characterId ? { characterId: player.characterId } : {}),
  };
}

export const createGameSession = mutation({
  handler: async (ctx) => {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
      const code = generateGameCode();
      const collision = await ctx.db
        .query('gameSessions')
        .withIndex('code', (q) => q.eq('code', code))
        .first();
      if (collision) continue;
      await ctx.db.insert('gameSessions', {
        code,
        status: 'lobby',
        createdAt: Date.now(),
      });
      return { gameCode: code };
    }
    throw new ConvexError('No se pudo generar un código de partida. Intentá nuevamente.');
  },
});

export const getLobby = query({
  args: { gameCode: v.string() },
  handler: async (ctx, args) => {
    const code = normalizeGameCode(args.gameCode);
    const session = await ctx.db
      .query('gameSessions')
      .withIndex('code', (q) => q.eq('code', code))
      .unique();
    if (!session) return null;
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('sessionId', (q) => q.eq('sessionId', session._id))
      .collect();
    return toPublicLobby(session, players);
  },
});

export const joinGameSession = mutation({
  args: {
    gameCode: v.string(),
    name: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const code = normalizeGameCode(args.gameCode);
      const session = await ctx.db
        .query('gameSessions')
        .withIndex('code', (q) => q.eq('code', code))
        .unique();
      const lobbySession = requireLobbySession(session);
      const tokenHash = await hashToken(args.token);
      const players = await ctx.db
        .query('lobbyPlayers')
        .withIndex('sessionId', (q) => q.eq('sessionId', lobbySession._id))
        .collect();
      const plan = planLobbyJoin(session, players, {
        name: args.name,
        tokenHash,
        joinedAt: Date.now(),
      });
      if (plan.kind === 'reconnect') {
        return { player: publicPlayer(plan.player), reconnected: true };
      }
      await ctx.db.insert('lobbyPlayers', {
        sessionId: lobbySession._id,
        ...plan.player,
      });
      return { player: publicPlayer(plan.player), reconnected: false };
    } catch (error) {
      throw new ConvexError(
        error instanceof Error ? error.message : 'No se pudo entrar a la partida.',
      );
    }
  },
});

export const reconnectGameSession = mutation({
  args: {
    gameCode: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const code = normalizeGameCode(args.gameCode);
      const session = await ctx.db
        .query('gameSessions')
        .withIndex('code', (q) => q.eq('code', code))
        .unique();
      const lobbySession = requireLobbySession(session);
      const tokenHash = await hashToken(args.token);
      const players = await ctx.db
        .query('lobbyPlayers')
        .withIndex('sessionId', (q) => q.eq('sessionId', lobbySession._id))
        .collect();
      return publicPlayer(requireReconnectPlayer(players, tokenHash));
    } catch (error) {
      throw new ConvexError(error instanceof Error ? error.message : 'No se pudo reconectar.');
    }
  },
});

export const selectCharacter = mutation({
  args: {
    gameCode: v.string(),
    controllerToken: v.string(),
    characterId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const code = normalizeGameCode(args.gameCode);
      const session = await ctx.db
        .query('gameSessions')
        .withIndex('code', (q) => q.eq('code', code))
        .unique();
      const lobbySession = requireLobbySession(session);
      const tokenHash = await hashToken(args.controllerToken);
      const players = await ctx.db
        .query('lobbyPlayers')
        .withIndex('sessionId', (q) => q.eq('sessionId', lobbySession._id))
        .collect();
      const selection = planCharacterSelection(session, players, tokenHash, args.characterId);
      const playerDocument = players.find((player) => player.tokenHash === tokenHash)!;
      await ctx.db.patch(playerDocument._id, { characterId: selection.characterId });
      return publicPlayer({ ...selection.player, characterId: selection.characterId });
    } catch (error) {
      throw new ConvexError(
        error instanceof Error ? error.message : 'No se pudo elegir el personaje.',
      );
    }
  },
});
