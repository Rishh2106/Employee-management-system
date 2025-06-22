const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || text);
    } catch {
      throw new Error(text);
    }
  }
  // If response has no content, return null
  if (res.status === 204 || res.headers.get('content-length') === '0') return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
} 