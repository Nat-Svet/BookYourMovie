// src/api/api.js
const BASE_URL = "https://shfe-diplom.neto-server.ru";

function toFormData(payload = {}) {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
}

export default class API {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL.replace(/\/+$/, "");
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(path, { method = "GET", body } = {}) {
    const url = `${this.baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
    const options = { method, headers: {} };

    if (method !== "GET" && body) {
      options.body = toFormData(body);
    }
    if (this.token) {
      options.headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {}
      throw new Error(errorMessage);
    }

    // ответ ожидаем в JSON; если не JSON — бросаем понятную ошибку
    try {
      const data = await response.json();
      if (data && data.success === false) {
        throw new Error(data.error || "Ошибка запроса");
      }
      return data.result !== undefined ? data.result : data;
    } catch (e) {
      throw new Error("Не удалось обработать ответ сервера");
    }
  }

  // ====== Методы API ======
  login({ login, password }) {
    return this.request("/login", {
      method: "POST",
      body: { login, password },
    }).then((res) => {
      if (res && res.token) {
        this.setToken(res.token);
        localStorage.setItem("token", res.token);
      }
      return res;
    });
  }

  // ✅ ВАЖНО: правильный путь
  getAllData() {
    return this.request("/alldata", { method: "GET" });
  }

  buyTickets(payload) {
    return this.request("/ticket", { method: "POST", body: payload });
  }

  createHall(payload) {
    return this.request("/hall", { method: "POST", body: payload });
  }

  deleteHall(hallId) {
    return this.request(`/hall/${hallId}`, { method: "DELETE" });
  }

  updatePrices(hallId, payload) {
    return this.request(`/hall/${hallId}/price`, { method: "POST", body: payload });
  }

  createMovie(payload) {
    return this.request("/movie", { method: "POST", body: payload });
  }

  deleteMovie(movieId) {
    return this.request(`/movie/${movieId}`, { method: "DELETE" });
  }

  createSession(payload) {
    return this.request("/session", { method: "POST", body: payload });
  }

  deleteSession(sessionId) {
    return this.request(`/session/${sessionId}`, { method: "DELETE" });
  }

  getHallConfig(hallId) {
    return this.request(`/hall/${hallId}`, { method: "GET" });
  }
}
