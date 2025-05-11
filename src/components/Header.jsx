import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"; // Подключаем стили

const Header = () => {
  const navigate = useNavigate(); // Хук для программной маршрутизации (если понадобится)

  return (
    <header>
      <Link to="/" className="logo">
        <img src="/images/logo.png" alt="FootStat Logo" />
      </Link>
      <div className="header-right">
        <Link to="/about" className="about-link">О нас</Link>
        {/* Используем Link для маршрутизации */}
        <Link to="/login" className="auth-button">
          Войти
        </Link>
      </div>
    </header>
  );
};

export default Header;