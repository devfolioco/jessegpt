// Server-only runtime flag. Unset (or any value other than "true") keeps the app live.
export function isProjectPaused() {
  return process.env.SERVICE_PAUSED === 'true';
}
