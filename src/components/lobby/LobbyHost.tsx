import { useMutation, useQuery } from 'convex/react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { getPlayableCharacter } from '../../../shared/playableCharacters';
import { getLobbyJoinUrl } from './lobbyUrl';

export default function LobbyHost() {
  const createGameSession = useMutation(api.gameSessions.createGameSession);
  const [gameCode, setGameCode] = useState<string>();
  const [error, setError] = useState<string>();
  const [creating, setCreating] = useState(false);
  const lobby = useQuery(api.gameSessions.getLobby, gameCode ? { gameCode } : 'skip');
  const joinUrl = useMemo(() => (gameCode ? getLobbyJoinUrl(gameCode) : undefined), [gameCode]);

  const createGame = async () => {
    setCreating(true);
    setError(undefined);
    try {
      const result = await createGameSession();
      setGameCode(result.gameCode);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setCreating(false);
    }
  };

  if (!gameCode) {
    return (
      <section
        className="pointer-events-auto fixed right-3 top-3 z-20 max-h-[calc(100vh-1.5rem)] w-[min(92vw,46rem)] overflow-y-auto border-4 border-[#171421] bg-[#23263a]/95 p-4 text-center text-white shadow-xl"
        data-testid="lobby-host-panel"
      >
        <h2 className="font-display text-3xl tracking-wide text-[#fec742] sm:text-5xl">
          La República Imposible
        </h2>
        <p className="my-3 text-sm sm:text-base">Lobby local para hasta cuatro jugadores.</p>
        <button
          className="button bg-transparent text-lg uppercase sm:text-2xl disabled:opacity-50"
          disabled={creating}
          onClick={() => void createGame()}
          type="button"
        >
          <span>{creating ? 'Creando...' : 'Crear partida'}</span>
        </button>
        {error && (
          <p className="mt-3 text-red-300" role="alert">
            {error}
          </p>
        )}
      </section>
    );
  }

  const players = lobby?.players ?? [];
  return (
    <section
      className="pointer-events-auto fixed right-3 top-3 z-20 grid max-h-[calc(100vh-1.5rem)] w-[min(94vw,50rem)] gap-5 overflow-y-auto border-4 border-[#171421] bg-[#23263a]/95 p-5 text-white shadow-xl md:grid-cols-[1fr_auto]"
      data-testid="lobby-host-panel"
    >
      <div>
        <h2 className="font-display text-3xl tracking-wide text-[#fec742] sm:text-5xl">
          La República Imposible
        </h2>
        <p className="mt-3 text-sm uppercase text-slate-300">Código</p>
        <p
          className="font-display text-5xl tracking-[0.16em] text-white sm:text-7xl"
          data-testid="game-code"
        >
          {gameCode}
        </p>
        <p className="mt-4 text-sm uppercase text-slate-300">Jugadores conectados</p>
        <p className="mt-1 text-lg" data-testid="ready-count">
          Jugadores listos: {lobby?.readyPlayers ?? 0} / 4
        </p>
        <ol className="mt-2 grid gap-2" aria-label="Jugadores conectados">
          {Array.from({ length: 4 }, (_, index) => {
            const player = players[index];
            const character = player?.characterId
              ? getPlayableCharacter(player.characterId)
              : undefined;
            return (
              <li className="border-2 border-[#3a4466] bg-[#181425] px-3 py-2" key={index}>
                {player ? (
                  <>
                    <span>✓ {player.name} — {character?.shortName ?? 'Sin personaje'}</span>
                    {character && (
                      <span className="block text-sm text-[#fec742]">{character.archetype}</span>
                    )}
                  </>
                ) : (
                  '○ Esperando jugador...'
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {joinUrl && (
        <div className="flex flex-col items-center justify-center gap-3 md:max-w-64">
          <div className="bg-white p-3" aria-label="Código QR para unirse">
            <QRCodeSVG value={joinUrl} size={184} level="M" />
          </div>
          <a className="break-all text-center text-sm text-[#fec742] underline" href={joinUrl}>
            {joinUrl}
          </a>
        </div>
      )}
    </section>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No se pudo crear la partida.';
}
