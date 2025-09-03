const BASE_URL = "https://shfe-diplom.neto-server.ru";

// Функция превращает объект в FormData для отправки на сервер //
function toFormData(payload = {}) {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
}

// Основной класс API для общения с сервером //
export default class API {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL.replace(/\/+$/, "");
    this.token = null;
  }

  // сохранить токен в объекте API //
  setToken(token) {
    this.token = token;
  }

  // метод запросов к серверу //
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

    // если это не GET, готовим тело запроса // не могу вспомнить для чего это нужно было //
    if (method !== "GET" && body) {
      if (body instanceof FormData) {
        options.body = body; // если уже FormData //
      } else {
        options.body = toFormData(body); // иначе превращаем в FormData //
      }
    }

    try {
      // отправляем запрос //
      const response = await fetch(url, options);

      // если сервер вернул ошибку //
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
        // пробуем распарсить как JSON //
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

  // Авторизация //
  login({ login, password }) {
    return this.request("/login", {
      method: "POST",
      body: { login, password },
    }).then((res) => {
      if (res?.token) {
        this.setToken(res.token);
        localStorage.setItem("token", res.token); // сохраняем токен в браузере //
      }
      return res;
    });
  }

  // Получить все данные (залы, фильмы, сеансы и т.д.) //
  getAllData() {
    return this.request("/alldata", { method: "GET" });
  }

  // Создать новый зал //
  createHall(payload) {
    return this.request("/hall", { method: "POST", body: payload });
  }

  // Удалить зал //
  deleteHall(hallId) {
    return this.request(`/hall/${hallId}`, { method: "DELETE" });
  }

  // Обновить цены в зале //
  updatePrices(hallId, payload) {
    return this.request(`/price/${hallId}`, { method: "POST", body: payload });
  }

  // Добавить фильм //
  createMovie(formData) {
    return this.request("/film", {
      method: "POST",
      body: formData,
    });
  }

  // Удалить фильм //
  deleteMovie(movieId) {
    return this.request(`/film/${movieId}`, { method: "DELETE" });
  }

  // Добавить сеанс //
  createSession(payload) {
    return this.request("/seance", { method: "POST", body: payload });
  }

  // Удалить сеанс //
  deleteSession(sessionId) {
    return this.request(`/seance/${sessionId}`, {
      method: "DELETE"
    });
  }

  // Получить конфигурацию конкретного зала //
  getHallConfig(hallId) {
    return this.request(`/hall/${hallId}`, { method: "GET" });
  }

  // Открыть или закрыть продажи билетов в зале //
  toggleHallOpen(hallId, isOpen) {
    return this.request(`/open/${hallId}`, {
      method: "POST",
      body: { hallOpen: isOpen ? 1 : 0 },
    });
  }

  // ==== Методы API для клиентской части ==== //

  // Получение конфигурации зала для сеанса //
  getSeanceHallConfig(seanceId, date) {
    const params = new URLSearchParams({
      seanceId: seanceId.toString(),
      date: date
    }).toString();

    return this.request(`/hallconfig?${params}`, { method: "GET" });
  }

  // Покупка билетов //
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