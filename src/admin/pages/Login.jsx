import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminHeader from '../components/AdminHeader';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css';

const Login = () => {
  return (
    <AdminLayout>
     
     <div className="login-container">
      <AdminHeader />
   
      <LoginForm />
     </div>
    
     
    </AdminLayout>
  );
};

export default Login;