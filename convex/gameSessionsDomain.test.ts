import {
  GAME_CODE_LENGTH,
  MAX_LOBBY_PLAYERS,
  generateGameCode,
  planCharacterSelection,
  planLobbyJoin,
  requireLobbySession,
  requireReconnectPlayer,
  toPublicLobby,
  validateControllerToken,
} from './gameSessionsDomain';
import type { PlayableCharacterId } from '../shared/playableCharacters';

const session = {
  code: 'ABC234',
  status: 'lobby' as const,
  createdAt: 100,
};

function player(index: number, characterId?: PlayableCharacterId) {
  return {
    name: `Jugador ${index}`,
    tokenHash: `hash-${index}`,
    joinedAt: index,
    ...(characterId ? { characterId } : {}),
  };
}

describe('game sessions domain', () => {
  test('creates a valid readable game code', () => {
    const code = generateGameCode(() => 0.25);
    expect(code).toHaveLength(GAME_CODE_LENGTH);
    expect(code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
  });

  test('accepts a valid lobby join', () => {
    const result = planLobbyJoin(session, [], {
      name: '  Lucía  ',
      tokenHash: 'hash-new',
      joinedAt: 200,
    });
    expect(result).toEqual({
      kind: 'join',
      player: { name: 'Lucía', tokenHash: 'hash-new', joinedAt: 200 },
    });
  });

  test('rejects a fifth player', () => {
    const players = Array.from({ length: MAX_LOBBY_PLAYERS }, (_, index) => player(index));
    expect(() =>
      planLobbyJoin(session, players, {
        name: 'Quinto',
        tokenHash: 'hash-fifth',
        joinedAt: 500,
      }),
    ).toThrow('La partida ya tiene 4 jugadores.');
  });

  test('rejects an unknown game code', () => {
    expect(() => requireLobbySession(null)).toThrow('La partida no existe.');
  });

  test('reconnect returns the same player without creating a duplicate', () => {
    const players = [player(1)];
    const result = planLobbyJoin(session, players, {
      name: 'Nombre distinto',
      tokenHash: players[0].tokenHash,
      joinedAt: 999,
    });
    expect(result).toEqual({ kind: 'reconnect', player: players[0] });
    expect(players).toHaveLength(1);
  });

  test('rejects an invalid reconnect token', () => {
    expect(() => requireReconnectPlayer([player(1)], 'unknown-hash')).toThrow(
      'Token de sesión inválido.',
    );
    expect(() => validateControllerToken('not-a-controller-token')).toThrow(
      'Token de sesión inválido.',
    );
  });

  test('public lobby never exposes token hashes', () => {
    const publicLobby = toPublicLobby(session, [player(1)]);
    expect(publicLobby.players).toEqual([{ name: 'Jugador 1', joinedAt: 1 }]);
    expect(JSON.stringify(publicLobby)).not.toContain('tokenHash');
    expect(JSON.stringify(publicLobby)).not.toContain('hash-1');
  });

  test('rejects empty player names', () => {
    expect(() =>
      planLobbyJoin(session, [], { name: '   ', tokenHash: 'hash-new', joinedAt: 200 }),
    ).toThrow('Ingresá un nombre.');
  });

  test('accepts a valid character selection', () => {
    const players = [player(1)];
    expect(planCharacterSelection(session, players, 'hash-1', 'san-martin')).toEqual({
      player: players[0],
      characterId: 'san-martin',
    });
  });

  test('rejects an invalid character id', () => {
    expect(() => planCharacterSelection(session, [player(1)], 'hash-1', 'inventado')).toThrow(
      'El personaje seleccionado no existe.',
    );
  });

  test('rejects a character already selected by another player', () => {
    expect(() =>
      planCharacterSelection(session, [player(1, 'san-martin'), player(2)], 'hash-2', 'san-martin'),
    ).toThrow('Ese personaje ya fue elegido por otro jugador.');
  });

  test('the same player can change character and releases the previous one', () => {
    const players = [player(1, 'san-martin'), player(2)];
    const change = planCharacterSelection(session, players, 'hash-1', 'belgrano');
    players[0].characterId = change.characterId;
    expect(planCharacterSelection(session, players, 'hash-2', 'san-martin').characterId).toBe(
      'san-martin',
    );
  });

  test('reconnect keeps the selected character', () => {
    const selectedPlayer = player(1, 'san-martin');
    expect(requireReconnectPlayer([selectedPlayer], 'hash-1').characterId).toBe('san-martin');
  });

  test('a fourth player can join', () => {
    const players = [player(1), player(2), player(3)];
    expect(
      planLobbyJoin(session, players, {
        name: 'Jugador 4',
        tokenHash: 'hash-4',
        joinedAt: 4,
      }).kind,
    ).toBe('join');
  });

  test('public lobby reports readiness from selected characters', () => {
    const publicLobby = toPublicLobby(session, [
      player(1, 'san-martin'),
      player(2, 'belgrano'),
      player(3),
    ]);
    expect(publicLobby.readyPlayers).toBe(2);
    expect(publicLobby.players[0].characterId).toBe('san-martin');
  });
});
