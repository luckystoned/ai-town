import {
  GAME_CODE_LENGTH,
  MAX_LOBBY_PLAYERS,
  generateGameCode,
  planLobbyJoin,
  requireLobbySession,
  requireReconnectPlayer,
  toPublicLobby,
  validateControllerToken,
} from './gameSessionsDomain';

const session = {
  code: 'ABC234',
  status: 'lobby' as const,
  createdAt: 100,
};

function player(index: number) {
  return {
    name: `Jugador ${index}`,
    tokenHash: `hash-${index}`,
    joinedAt: index,
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
});
