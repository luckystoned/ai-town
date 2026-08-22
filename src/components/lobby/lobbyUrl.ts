export function getLobbyJoinUrl(gameCode: string) {
  const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.trim();
  const frontend = new URL(publicAppUrl || window.location.origin);
  frontend.pathname = `/ai-town/join/${gameCode}`;
  return frontend.toString();
}
