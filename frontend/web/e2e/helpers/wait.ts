/**
 * Poll a URL until it returns a successful response, or timeout.
 * Used to wait for backend/frontend to be ready.
 */
export async function waitForService(
  url: string,
  options?: { timeoutMs?: number; intervalMs?: number; expectJson?: boolean }
): Promise<void> {
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const intervalMs = options?.intervalMs ?? 500;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        if (options?.expectJson) {
          const data = await response.json();
          if (data.status === 'ok') return;
        } else {
          return;
        }
      }
    } catch {
      // Service not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`Service at ${url} did not become ready within ${timeoutMs}ms`);
}
