import { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  getPlayableCharacter,
  playableCharacters,
  type PlayableCharacterId,
} from '../../../shared/playableCharacters';
import { createControllerToken, controllerTokenStorageKey } from './controllerToken';

type ConnectedPlayer = {
  name: string;
  joinedAt: number;
  characterId?: PlayableCharacterId;
};

export default function JoinLobbyPage({ gameCode: rawGameCode }: { gameCode: string }) {
  const gameCode = rawGameCode.trim().toUpperCase();
  const lobby = useQuery(api.gameSessions.getLobby, { gameCode });
  const joinGameSession = useMutation(api.gameSessions.joinGameSession);
  const reconnectGameSession = useMutation(api.gameSessions.reconnectGameSession);
  const selectCharacter = useMutation(api.gameSessions.selectCharacter);
  const [name, setName] = useState('');
  const [connectedPlayer, setConnectedPlayer] = useState<ConnectedPlayer>();
  const [controllerToken, setControllerToken] = useState<string>();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [selecting, setSelecting] = useState<PlayableCharacterId>();
  const [checkingReconnect, setCheckingReconnect] = useState(true);
  const storageKey = controllerTokenStorageKey(gameCode);
  const selectedCharacter = connectedPlayer?.characterId
    ? getPlayableCharacter(connectedPlayer.characterId)
    : undefined;

  useEffect(() => {
    const token = localStorage.getItem(storageKey);
    if (!token) {
      setCheckingReconnect(false);
      return;
    }
    let active = true;
    reconnectGameSession({ gameCode, token })
      .then((player) => {
        if (active) {
          setControllerToken(token);
          setConnectedPlayer(player);
        }
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
      setControllerToken(token);
      setConnectedPlayer(result.player);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const chooseCharacter = async (characterId: PlayableCharacterId) => {
    if (!controllerToken) return;
    setSelecting(characterId);
    setError(undefined);
    try {
      const player = await selectCharacter({ gameCode, controllerToken, characterId });
      setConnectedPlayer(player);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSelecting(undefined);
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
        ) : connectedPlayer ? (
          <div className="mt-8" data-testid="connected-player">
            <p className="text-center text-xl">Hola, {connectedPlayer.name}</p>
            <h2 className="mt-2 text-center font-display text-2xl text-[#fec742]">
              Elegí tu personaje
            </h2>
            {selectedCharacter && (
              <section
                aria-label={`Skills de ${selectedCharacter.shortName}`}
                className="mt-5 border-2 border-[#fec742] bg-[#181425] p-4"
                data-testid="selected-character-skills"
              >
                <h3 className="text-center font-display text-2xl text-white">
                  {selectedCharacter.shortName}
                </h3>
                <p className="text-center text-sm text-[#fec742]">
                  {selectedCharacter.archetype}
                </p>
                <dl className="mt-4 grid gap-3">
                  {[
                    selectedCharacter.skills.active,
                    selectedCharacter.skills.passive,
                    selectedCharacter.skills.ultimate,
                  ].map((skill) => (
                    <div key={skill.id}>
                      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {skill.kind}
                      </dt>
                      <dd className="text-base text-white">{skill.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <div className="mt-5 grid gap-3">
              {playableCharacters.map((character) => {
                const selectedByMe = connectedPlayer.characterId === character.id;
                const taken = !selectedByMe && lobby.players.some(
                  (player) => player.characterId === character.id,
                );
                const state = selectedByMe
                  ? 'SELECCIONADO POR MÍ'
                  : taken
                    ? 'OCUPADO'
                    : 'DISPONIBLE';
                return (
                  <button
                    aria-pressed={selectedByMe}
                    className={`border-2 p-3 text-left transition-colors ${
                      selectedByMe
                        ? 'border-emerald-400 bg-emerald-950/70'
                        : taken
                          ? 'cursor-not-allowed border-slate-700 bg-slate-900/70 opacity-55'
                          : 'border-[#3a4466] bg-[#181425] hover:border-[#fec742]'
                    }`}
                    disabled={taken || selecting !== undefined}
                    key={character.id}
                    onClick={() => void chooseCharacter(character.id)}
                    type="button"
                  >
                    <span className="block text-lg">{character.shortName}</span>
                    <span className="block text-sm text-[#fec742]">{character.archetype}</span>
                    <span className="mt-1 block text-xs text-slate-300">
                      {character.shortDescription}
                    </span>
                    <span className="mt-2 block text-xs font-bold uppercase">{state}</span>
                  </button>
                );
              })}
            </div>
            {error && (
              <p className="mt-4 text-center text-red-300" role="alert">
                {error}
              </p>
            )}
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
