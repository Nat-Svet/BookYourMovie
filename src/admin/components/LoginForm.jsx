// src/admin/components/LoginForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import '../styles/LoginForm.css';

const api = new API(); // или new API(import.meta.env.VITE_API_URL) если используешь .env

const LoginForm = () => {
  const navigate = useNavigate(); // для перенаправления
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.login({ login, password });

      // Опционально: сохранить токен, если сервер его возвращает
      // localStorage.setItem("token", api.token);

      // Перенаправляем в админку (например, на /admin)
      navigate('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-title">АВТОРИЗАЦИЯ</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="login-label">E-mail</label>
        <input
          id="email"
          type="email"
          className="login-input"
          placeholder="example@domain.xyz"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password" className="login-label">Пароль</label>
        <input
          id="password"
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <button type="submit" className="login-button">
          АВТОРИЗОВАТЬСЯ
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
