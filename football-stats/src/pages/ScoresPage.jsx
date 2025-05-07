import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCountriesAndLeagues } from "../services/api";
import "../components/ScoresPageCard.css"; // Подключаем CSS

const ScoresPage = () => {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountriesAndLeagues = async () => {
      setLoadingCountries(true);
      setError(null);

      try {
        const data = await getCountriesAndLeagues();
        setCountries(Object.entries(data)); // Преобразуем объект в массив [страна, чемпионаты]
        console.log("Загруженные страны и чемпионаты:", data);
      } catch (err) {
        console.error("Ошибка при загрузке стран и чемпионатов:", err);
        setError("Не удалось загрузить данные. Попробуйте позже.");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountriesAndLeagues();
  }, []);

  const handleLeagueClick = (leagueId) => {
    navigate(`/matches/${leagueId}`);
  };

  if (loadingCountries) return <div className="loading">Загрузка стран и чемпионатов...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="scores-page">
      <h1 className="title">Результаты матчей</h1>

      <div className="leagues-container">
        <h2>Чемпионаты</h2>
        {countries.length > 0 ? (
          countries.map(([country, leagues]) => (
            <div key={country} className="country">
              <h3 className="country-name">{country}</h3>
              <ul className="leagues-list">
                {leagues.map((league) => (
                  <li key={league.id} className="league-item">
                    <button
                      className="league-button"
                      onClick={() => handleLeagueClick(league.id)}
                    >
                      {league.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="no-leagues">Нет доступных чемпионатов.</p>
        )}
      </div>
    </div>
  );
};

export default ScoresPage;