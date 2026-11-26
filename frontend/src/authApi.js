// На компьютере — локальный сервер, в интернете — адрес из настройки VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, body) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Не удалось подключиться к серверу Python. Проверь, запущен ли backend.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = result.detail;
    const description = Array.isArray(detail)
      ? detail.map((part) => part.msg).join("; ")
      : detail;
    throw new Error(description || "Ошибка запроса");
  }
  sessionStorage.setItem("beautyhub_auth", JSON.stringify(result));
  return result;
}

export function registerUser({ fullName, email, password, role, phone }) {
  return request("/auth/register", {
    full_name: fullName,
    email,
    password,
    role,
    phone: phone || null,
  });
}

export function loginUser({ email, password }) {
  return request("/auth/login", { email, password });
}

export function getSavedUser() {
  try {
    return JSON.parse(sessionStorage.getItem("beautyhub_auth") || "null")?.user ?? null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  sessionStorage.removeItem("beautyhub_auth");
}

export async function getCurrentUser() {
  const auth = JSON.parse(sessionStorage.getItem("beautyhub_auth") || "null");
  if (!auth?.access_token) return null;
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${auth.access_token}` },
  });
  if (response.status === 401) {
    logoutUser();
    return null;
  }
  if (!response.ok) throw new Error("Не удалось проверить аккаунт");
  return response.json();
}
