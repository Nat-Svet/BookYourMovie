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

  async request(path, { method = "GET", body, headers = {} } = {}) {
    const url = `${this.baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
    const options = { method, headers: {} };

    // Проверяем и обновляем токен перед каждым запросом
    const token = localStorage.getItem('token');
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
      this.token = token;
    } else if (this.token) {
      options.headers["Authorization"] = `Bearer ${this.token}`;
    }

    if (method !== "GET" && body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.body = toFormData(body);
      }
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch { }
        throw new Error(errorMessage);
      }

      // Обрабатываем пустой ответ
      const responseText = await response.text();
      if (!responseText) {
        return null;
      }

      try {
        const data = JSON.parse(responseText);
        if (data && data.success === false) {
          throw new Error(data.error || "Ошибка запроса");
        }
        return data.result !== undefined ? data.result : data;
      } catch (e) {
        // Если не JSON, возвращаем текст как есть
        return responseText;
      }
    } catch (error) {
      console.error('Ошибка запроса:', error);
      throw error;
    }
  }

  // ==== Методы API для админской части ====

  login({ login, password }) {
    return this.request("/login", {
      method: "POST",
      body: { login, password },
    }).then((res) => {
      if (res?.token) {
        this.setToken(res.token);
        localStorage.setItem("token", res.token);
      }
      return res;
    });
  }

  getAllData() {
    return this.request("/alldata", { method: "GET" });
  }

  createHall(payload) {
    return this.request("/hall", { method: "POST", body: payload });
  }

  deleteHall(hallId) {
    return this.request(`/hall/${hallId}`, { method: "DELETE" });
  }

  updatePrices(hallId, payload) {
    return this.request(`/price/${hallId}`, { method: "POST", body: payload });
  }

  createMovie(formData) {
    return this.request("/film", {
      method: "POST",
      body: formData,
    });
  }

  deleteMovie(movieId) {
    return this.request(`/film/${movieId}`, { method: "DELETE" });
  }

  createSession(payload) {
    return this.request("/seance", { method: "POST", body: payload });
  }

  deleteSession(sessionId) {
    return this.request(`/seance/${sessionId}`, {
      method: "DELETE"
    });
  }

  getHallConfig(hallId) {
    return this.request(`/hall/${hallId}`, { method: "GET" });
  }

  toggleHallOpen(hallId, isOpen) {
    return this.request(`/open/${hallId}`, {
      method: "POST",
      body: { hallOpen: isOpen ? 1 : 0 },
    });
  }

  // ==== Методы API для клиентской части ====

  // Получение конфигурации зала для сеанса
  getSeanceHallConfig(seanceId, date) {
    const params = new URLSearchParams({
      seanceId: seanceId.toString(),
      date: date
    }).toString();
    
    return this.request(`/hallconfig?${params}`, { method: "GET" });
  }

  // Покупка билетов (клиентская версия)
  buyTicketsClient(seanceId, ticketDate, tickets) {
    return this.request("/ticket", {
      method: "POST",
      body: {
        seanceId,
        ticketDate,
        tickets: JSON.stringify(tickets)
      }
    });
  }
}