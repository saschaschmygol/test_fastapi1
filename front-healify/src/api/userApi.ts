
const API_URL = "http://localhost:8000";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Ошибка входа");
  }

  return res.json();
}

export async function refreshTokens(): Promise<LoginResponse | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) return null;

  return res.json();
}

export async function getMe() {
  const access = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${access}` },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function registerRequest(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Ошибка регистрации");
  }

  return res.json();
}

export async function resetPasswordRequest(email: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      new_password: newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Не удалось изменить пароль");
  }

  return res.json();
}


export async function sendTestContentsRequest(sessionId: string, testId: number) {
  const res = await fetch(
    `${API_URL}/session/send_test_contents?session_id=${sessionId}&test_id=${testId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Ошибка отправки теста в WebSocket");
  }

  return res.json();
}
