// src/api/api.js

const BASE_URL = "https://shfe-diplom.neto-server.ru";

/**
 * Вспомогательная функция: превращает обычный объект в FormData
 */
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
    this.baseURL = baseURL.replace(/\/+$/, ""); // убираем лишний /
    this.token = null; // сюда можно сохранить токен после логина
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

    // если есть токен — добавляем его в заголовок
    if (this.token) {
      options.headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, options);
    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(`Ошибка: сервер вернул не-JSON`);
    }

    if (data.success === false) {
      throw new Error(data.error || "Ошибка запроса");
    }

    return data.result;
  }

  // ====== Методы API ======

  /**
   * Авторизация администратора
   * POST /login
   * body: { login, password }
   */
  login({ login, password }) {
    return this.request("/login", {
      method: "POST",
      body: { login, password },
    }).then((res) => {
      // если сервер вернёт токен — сохраним
      if (res && res.token) {
        this.setToken(res.token);
        localStorage.setItem("token", res.token);
      }
      return res;
    });
  }

  /**
   * Получение всех данных (залы, фильмы, сеансы)
   * GET /alldata
   */
  getAllData() {
    return this.request("/alldata", { method: "GET" });
  }

  /**
   * Покупка билетов
   * POST /ticket
   * body: { sessionId, seats, ... }
   */
  buyTickets(payload) {
    return this.request("/ticket", { method: "POST", body: payload });
  }

  // ===== Методы для админки =====

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
}
