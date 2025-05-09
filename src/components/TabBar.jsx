import React from "react";
import { NavLink } from "react-router-dom";
import "./TabBar.css";

const TabBar = () => {
  return (
    <div className="tab-bar glass-effect">
      <NavLink
        to="/matches"
        className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}
      >
        <div className="tab-icon">
          <img src="/images/matches.png" alt="Матчи" />
        </div>
        <span>Результаты</span>
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "tab-item active center-tab" : "tab-item center-tab"
        }
      >
        <div className="tab-icon">
          <img src="/images/heart.png" alt="Моя команда" />
        </div>
        <span>Моя команда</span>
      </NavLink>
      <NavLink
        to="/tables"
        className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}
      >
        <div className="tab-icon">
          <img src="/images/trophy.png" alt="Таблицы" />
        </div>
        <span>Таблицы</span>
      </NavLink>
    </div>
  );
};

export default TabBar;