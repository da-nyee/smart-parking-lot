import React from 'react';
import AuthTemplate from '../components/auth/AuthTemplate';
import LoginForm from '../containers/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthTemplate type="login">
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;
