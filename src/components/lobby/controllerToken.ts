export function controllerTokenStorageKey(gameCode: string) {
  return `republica-imposible:lobby:${gameCode.toUpperCase()}:token`;
}

export function createControllerToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
