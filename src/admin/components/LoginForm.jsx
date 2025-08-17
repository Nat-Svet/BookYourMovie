import React from 'react';
import '../styles/LoginForm.css';

const LoginForm = () => {
  return (
    <div className="login-form-container">
      <h2 className="login-form-title">АВТОРИЗАЦИЯ</h2>
      <form className="login-form">
        <label htmlFor="email" className="login-label">E-mail</label>
        <input
          id="email"
          type="email"
          className="login-input"
          placeholder="example@domain.xyz"
          required
        />

        <label htmlFor="password" className="login-label">Пароль</label>
        <input
          id="password"
          type="password"
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          АВТОРИЗОВАТЬСЯ
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
