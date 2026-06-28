import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
export const API_URL = debuggerHost
  ? `http://${debuggerHost}:8000`
  : "http://192.168.1.176:8000";

export async function request(path, options = {}) {
  const { token, skipJsonHeader, ...fetchOptions } = options;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.body && !skipJsonHeader ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text || "Zahtjev nije uspio"}`);
    }
    if (response.status === 204) return null;
    return response.json();
  } catch (e) {
    if (e.name === "AbortError")
      throw new Error(`Server nije odgovorio.\n\nProvjeri da li backend radi (${API_URL})`);
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
