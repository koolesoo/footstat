import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthAction = () => {
    if (currentUser) {
      logout();
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <Link to="/" className="logo">
        <img src="/images/logo.png" alt="FootStat Logo" />
      </Link>

      <div className="header-right">
        <Link to="/about" className="nav-link">
          О нас
        </Link>

        <button 
          onClick={handleAuthAction}
          className={`auth-button ${currentUser ? 'logout' : ''}`}
        >
          {currentUser ? 'Выйти' : 'Войти'}
        </button>
      </div>
    </header>
  );
};

export default Header;