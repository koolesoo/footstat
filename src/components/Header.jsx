import React from "react";
import "./Header.css"; // Подключаем стили

const Header = () => {
  return (
    <header>
      <a href="/" className="logo">
        <img src="/images/logo.png" alt="FootStat Logo" />
      </a>
      <div className="header-right">
        <a href="/about" className="about-link">О нас</a>
        <button className="auth-button">Войти</button>
      </div>
    </header>
  );
};

export default Header;