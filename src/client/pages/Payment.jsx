import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ClientHeader from '../components/ClientHeader';
import PaymentProcedure from '../components/PaymentProcedure';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const {
    filmName,
    hallName,
    sessionTime,
    seats,
    price
  } = location.state;

  const handleCompletePayment = () => {
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
          onComplete={handleCompletePayment} // ← передаём коллбэк
        />
      </div>
    </Layout>
  );
};

export default Payment;
