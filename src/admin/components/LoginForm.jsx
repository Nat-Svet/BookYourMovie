import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import '../styles/LoginForm.css';

const api = new API();

const LoginForm = () => {
  const navigate = useNavigate(); // для перенаправления
  // Состояния для хранения введённых данных и ошибок /
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Обработка отправки формы //
  const handleSubmit = async (e) => {
    e.preventDefault(); // отключаем перезагрузку страницы по умолчанию //

    try {
      // Отправляем логин и пароль на сервер через API //
      await api.login({ login, password });

      // Перенаправляем в админку //
      navigate('/admin');
    } catch (err) {
      // Если произошла ошибка — показываем сообщение //
      setErrorMsg(err.message || 'Ошибка авторизации');
    }
  };


  return (
    <div className="login-form-container">
      {/* Заголовок формы */}
      <h2 className="login-form-title">АВТОРИЗАЦИЯ</h2>
      {/* Форма авторизации */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Поле ввода email */}
        <label htmlFor="email" className="login-label">E-mail</label>
        <input
          id="email"
          type="email"
          className="login-input"
          placeholder="example@domain.xyz"
          value={login}
          onChange={(e) => setLogin(e.target.value)} // обновляем состояние login при вводе //
          required
        />

        {/* Поле ввода пароля */}
        <label htmlFor="password" className="login-label">Пароль</label>
        <input
          id="password"
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // обновляем состояние password //
          required
        />

        {/* Блок ошибки, если авторизация не удалась */}
        {errorMsg && <div className="login-error">{errorMsg}</div>}

        {/* Кнопка отправки формы */}
        <button type="submit" className="login-button">
          АВТОРИЗОВАТЬСЯ
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
