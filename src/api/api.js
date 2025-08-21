// src/api/api.js

// Базовый URL API-сервера
const BASE_URL = "https://shfe-diplom.neto-server.ru";

// Функция преобразования объекта в FormData
function toFormData(payload = {}) {
  // Создаем новый экземпляр FormData
  const fd = new FormData();
  // Итерируемся по всем ключам и значениям объекта
  Object.entries(payload).forEach(([key, value]) => {
    // Добавляем только определенные и не null значения
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  // Возвращаем заполненный FormData
  return fd;
}

// Экспорт класса API для работы с HTTP-запросами
export default class API {
  // Конструктор класса, принимает базовый URL (по умолчанию BASE_URL)
  constructor(baseURL = BASE_URL) {
    // Убираем конечные слеши из URL
    this.baseURL = baseURL.replace(/\/+$/, "");
    // Инициализируем хранилище для токена авторизации
    this.token = null;
  }

  // Метод для установки токена авторизации
  setToken(token) {
    this.token = token;
  }

  // Базовый метод для выполнения HTTP-запросов
  async request(path, { method = "GET", body } = {}) {
    // Формируем полный URL из базового URL и пути
    const url = `${this.baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
    // Подготавливаем опции для fetch
    const options = { method, headers: {} };

    // Для не-GET запросов добавляем тело в формате FormData
    if (method !== "GET" && body) {
      options.body = toFormData(body);
    }
    // Добавляем заголовок авторизации если токен установлен
    if (this.token) {
      options.headers["Authorization"] = `Bearer ${this.token}`;
    }

    // Выполняем fetch-запрос
    const response = await fetch(url, options);

    // Обрабатываем HTTP-ошибки
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        // Пытаемся прочитать текст ошибки
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {}
      throw new Error(errorMessage);
    }

    // Парсим JSON-ответ
    try {
      const data = await response.json();
      // Обрабатываем ошибки API
      if (data && data.success === false) {
        throw new Error(data.error || "Ошибка запроса");
      }
      // Возвращаем result если есть, иначе все данные
      return data.result !== undefined ? data.result : data;
    } catch (e) {
      throw new Error("Не удалось обработать ответ сервера");
    }
  }

  // ====== Методы API ======

  // Метод авторизации
  login({ login, password }) {
    return this.request("/login", {
      method: "POST",
      body: { login, password },
    }).then((res) => {
      // Сохраняем токен при успешном ответе
      if (res && res.token) {
        this.setToken(res.token);
        localStorage.setItem("token", res.token);
      }
      return res;
    });
  }

  // Получение всех данных
  getAllData() {
    return this.request("/alldata", { method: "GET" });
  }

  // Покупка билетов
  buyTickets(payload) {
    return this.request("/ticket", { method: "POST", body: payload });
  }

  // Создание зала
  createHall(payload) {
    return this.request("/hall", { method: "POST", body: payload });
  }

  // Удаление зала
  deleteHall(hallId) {
    return this.request(`/hall/${hallId}`, { method: "DELETE" });
  }

  // Обновление цен в зале
  updatePrices(hallId, payload) {
    return this.request(`/hall/${hallId}/price`, { method: "POST", body: payload });
  }

  // Создание фильма
  createMovie(payload) {
    return this.request("/movie", { method: "POST", body: payload });
  }

  // Удаление фильма
  deleteMovie(movieId) {
    return this.request(`/movie/${movieId}`, { method: "DELETE" });
  }

  // Создание сеанса
  createSession(payload) {
    return this.request("/session", { method: "POST", body: payload });
  }

  // Удаление сеанса
  deleteSession(sessionId) {
    return this.request(`/session/${sessionId}`, { method: "DELETE" });
  }

  // Получение конфигурации зала
  getHallConfig(hallId) {
    return this.request(`/hall/${hallId}`, { method: "GET" });
  }
}