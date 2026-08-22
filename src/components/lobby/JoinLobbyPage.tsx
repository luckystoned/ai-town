import { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { createControllerToken, controllerTokenStorageKey } from './controllerToken';

export default function JoinLobbyPage({ gameCode: rawGameCode }: { gameCode: string }) {
  const gameCode = rawGameCode.trim().toUpperCase();
  const lobby = useQuery(api.gameSessions.getLobby, { gameCode });
  const joinGameSession = useMutation(api.gameSessions.joinGameSession);
  const reconnectGameSession = useMutation(api.gameSessions.reconnectGameSession);
  const [name, setName] = useState('');
  const [connectedName, setConnectedName] = useState<string>();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [checkingReconnect, setCheckingReconnect] = useState(true);
  const storageKey = controllerTokenStorageKey(gameCode);

  useEffect(() => {
    const token = localStorage.getItem(storageKey);
    if (!token) {
      setCheckingReconnect(false);
      return;
    }
    let active = true;
    reconnectGameSession({ gameCode, token })
      .then((player) => {
        if (active) setConnectedName(player.name);
      })
      .catch(() => {
        localStorage.removeItem(storageKey);
      })
      .finally(() => {
        if (active) setCheckingReconnect(false);
      });
    return () => {
      active = false;
    };
  }, [gameCode, reconnectGameSession, storageKey]);

  const join = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(undefined);
    const token = createControllerToken();
    try {
      const result = await joinGameSession({ gameCode, name, token });
      localStorage.setItem(storageKey, token);
      setConnectedName(result.player.name);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="game-background flex min-h-screen items-center justify-center p-4 font-body text-white">
      <section className="w-full max-w-md border-4 border-[#171421] bg-[#23263a]/95 p-5 shadow-2xl sm:p-8">
        <h1 className="game-title text-center font-display text-4xl leading-none sm:text-6xl">
          La República Imposible
        </h1>
        <p className="mt-6 text-center text-sm uppercase text-slate-300">Partida</p>
        <p
          className="text-center font-display text-5xl tracking-[0.14em]"
          data-testid="join-game-code"
        >
          {gameCode}
        </p>

        {lobby === undefined || checkingReconnect ? (
          <p className="mt-8 text-center">Conectando...</p>
        ) : lobby === null ? (
          <p className="mt-8 text-center text-red-300" role="alert">
            La partida no existe.
          </p>
        ) : connectedName ? (
          <div
            className="mt-8 border-2 border-emerald-400 bg-emerald-950/70 p-5 text-center"
            data-testid="connected-player"
          >
            <p className="text-sm uppercase text-emerald-200">Conectado</p>
            <p className="mt-2 text-2xl">✓ {connectedName}</p>
            <p className="mt-3 text-sm text-slate-300">Ya aparecés en la pantalla principal.</p>
          </div>
        ) : (
          <form className="mt-8" onSubmit={(event) => void join(event)}>
            <label className="block text-sm uppercase text-slate-200" htmlFor="player-name">
              Tu nombre
            </label>
            <input
              autoComplete="name"
              autoFocus
              className="mt-2 w-full border-2 border-[#3a4466] bg-[#181425] px-4 py-3 text-lg text-white outline-none focus:border-[#fec742]"
              id="player-name"
              maxLength={32}
              onChange={(event) => setName(event.target.value)}
              placeholder="Escribí tu nombre"
              value={name}
            />
            <button
              className="button mt-5 w-full bg-transparent text-xl uppercase disabled:opacity-50"
              disabled={submitting}
              type="submit"
            >
              <span>{submitting ? 'Entrando...' : 'Entrar'}</span>
            </button>
            {error && (
              <p className="mt-4 text-center text-red-300" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </section>
    </main>
  );
}

function errorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'No se pudo entrar a la partida.';
  return error.message.replace(/^.*Uncaught ConvexError:\s*/s, '').trim();
}
