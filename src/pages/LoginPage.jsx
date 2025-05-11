import React from "react";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  // Функция обработки данных формы
  const handleLogin = (email, password) => {
    console.log("Submitted credentials:", { email, password });
    // В будущем здесь будет логика авторизации через API
  };

  return (
    <div className="login-page">
      <AuthForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;