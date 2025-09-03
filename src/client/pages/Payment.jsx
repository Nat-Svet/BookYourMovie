import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Импортируем хуки для работы с маршрутизацией //
import Layout from '../components/Layout';
import ClientHeader from '../components/ClientHeader';
import PaymentProcedure from '../components/PaymentProcedure';
import '../styles/Payment.css';

// Компонент Payment — отвечает за страницу оплаты //
const Payment = () => {
  // useLocation — получаем данные, переданные со страницы выбора мест //
  const location = useLocation();
  // useNavigate — позволяет перейти на другую страницу //
  const navigate = useNavigate();

  // Если на страницу пришли без данных (например, напрямую по ссылке) //
  if (!location.state) {
    return (
      <Layout>
        <div className="paymentprocedure-wrapper">
          <ClientHeader />
          <p className="text-white text-center mt-5">
            Нет данных для оплаты. Вернитесь на страницу выбора мест.
          </p>
        </div>
      </Layout>
    );
  }

  // Достаём нужные данные из переданного состояния (state) //
  const {
    filmName,
    hallName,
    sessionTime,
    seats,
    price
  } = location.state;

  // Функция вызывается после завершения оплаты //
  const handleCompletePayment = () => {
    // Перенаправляем пользователя на страницу с билетом //
    navigate('/ticket', {
      state: {
        filmName,
        hallName,
        sessionTime,
        seats,
        price
      }
    });
  };

  // Основной рендер страницы оплаты //
  return (
    <Layout>
      <div className="paymentprocedure-wrapper">
        <ClientHeader />
        <PaymentProcedure
          film={filmName}
          hall={hallName}
          sessionStart={sessionTime}
          seats={seats}
          price={price}
          onComplete={handleCompletePayment} //  передаём коллбэк //
        />
      </div>
    </Layout>
  );
};

export default Payment;
