import React from 'react';
import Layout from '../components/Layout';
import ClientHeader from '../components/ClientHeader';
import PaymentProcedure from '../components/PaymentProcedure';
import '../styles/Payment.css';

const Payment = () => {
  return (
    <Layout>
     
     <div className="paymentprocedure-wrapper">
        
        <ClientHeader />
       
        <PaymentProcedure
          film="Звёздные войны XXIII: Атака клонированных клонов"
          seats={[6, 7]}
          hall={1}
          sessionStart="18:30"
          price={600}
        />
        </div>
      
    </Layout>
  );
};

export default Payment;
