export function getLobbyJoinUrl(gameCode: string) {
  const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
  if (!convexUrl) {
    throw new Error('Falta VITE_CONVEX_URL para construir la URL LAN.');
  }
  const configuredBackend = new URL(convexUrl);
  const frontend = new URL(window.location.origin);
  frontend.hostname = configuredBackend.hostname;
  frontend.port = window.location.port || '5173';
  frontend.pathname = `/ai-town/join/${gameCode}`;
  return frontend.toString();
}
