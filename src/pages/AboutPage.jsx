import React from 'react';
import '../components/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>О нашем сервисе</h1>
      <div className="about-content">
        <p>
          FootStat - это современный сервис для отслеживания футбольной статистики 
          и результатов матчей в реальном времени.
        </p>
        <p>
          Наша платформа предоставляет актуальные данные о чемпионатах, командах 
          и игроках со всего мира.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;