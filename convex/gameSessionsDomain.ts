import {
  isPlayableCharacterId,
  type PlayableCharacterId,
} from '../shared/playableCharacters';

export const MAX_LOBBY_PLAYERS = 4;
export const GAME_CODE_LENGTH = 6;

const GAME_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export type LobbySessionState = {
  code: string;
  status: 'lobby';
  createdAt: number;
};

export type LobbyPlayerState = {
  name: string;
  tokenHash: string;
  joinedAt: number;
  characterId?: PlayableCharacterId;
};

export function normalizeGameCode(code: string) {
  return code.trim().toUpperCase();
}

export function generateGameCode(random: () => number = Math.random) {
  let code = '';
  for (let index = 0; index < GAME_CODE_LENGTH; index += 1) {
    code += GAME_CODE_ALPHABET[Math.floor(random() * GAME_CODE_ALPHABET.length)];
  }
  return code;
}

export function validatePlayerName(name: string) {
  const normalized = name.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    throw new Error('Ingresá un nombre.');
  }
  if (normalized.length > 32) {
    throw new Error('El nombre puede tener hasta 32 caracteres.');
  }
  return normalized;
}

export function validateControllerToken(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    throw new Error('Token de sesión inválido.');
  }
  return token;
}

export function requireLobbySession<T extends LobbySessionState>(session: T | null): T {
  if (!session) {
    throw new Error('La partida no existe.');
  }
  if (session.status !== 'lobby') {
    throw new Error('La partida ya no acepta jugadores.');
  }
  return session;
}

export function planLobbyJoin(
  session: LobbySessionState | null,
  players: LobbyPlayerState[],
  input: { name: string; tokenHash: string; joinedAt: number },
) {
  requireLobbySession(session);
  const existing = players.find((player) => player.tokenHash === input.tokenHash);
  if (existing) {
    return { kind: 'reconnect' as const, player: existing };
  }
  if (players.length >= MAX_LOBBY_PLAYERS) {
    throw new Error('La partida ya tiene 4 jugadores.');
  }
  return {
    kind: 'join' as const,
    player: {
      name: validatePlayerName(input.name),
      tokenHash: input.tokenHash,
      joinedAt: input.joinedAt,
    },
  };
}

export function requireReconnectPlayer(players: LobbyPlayerState[], tokenHash: string) {
  const player = players.find((candidate) => candidate.tokenHash === tokenHash);
  if (!player) {
    throw new Error('Token de sesión inválido.');
  }
  return player;
}

export function validatePlayableCharacterId(characterId: string): PlayableCharacterId {
  if (!isPlayableCharacterId(characterId)) {
    throw new Error('El personaje seleccionado no existe.');
  }
  return characterId;
}

export function planCharacterSelection(
  session: LobbySessionState | null,
  players: LobbyPlayerState[],
  tokenHash: string,
  requestedCharacterId: string,
) {
  requireLobbySession(session);
  const player = requireReconnectPlayer(players, tokenHash);
  const characterId = validatePlayableCharacterId(requestedCharacterId);
  const taken = players.some(
    (candidate) => candidate.tokenHash !== tokenHash && candidate.characterId === characterId,
  );
  if (taken) {
    throw new Error('Ese personaje ya fue elegido por otro jugador.');
  }
  return { player, characterId };
}

export function toPublicLobby(session: LobbySessionState, players: LobbyPlayerState[]) {
  return {
    code: session.code,
    status: session.status,
    createdAt: session.createdAt,
    maxPlayers: MAX_LOBBY_PLAYERS,
    players: players
      .map(({ name, joinedAt, characterId }) => ({
        name,
        joinedAt,
        ...(characterId ? { characterId } : {}),
      }))
      .sort((left, right) => left.joinedAt - right.joinedAt),
    readyPlayers: players.filter((player) => player.characterId !== undefined).length,
  };
}
