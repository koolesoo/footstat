import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompetitions } from "../services/api"; // Импорт API
import "./ChampionshipList.css"; // Подключение CSS

const ChampionshipList = () => {
  const [competitionsByCountry, setCompetitionsByCountry] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для текста поиска
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCompetitions();
        // Группируем чемпионаты по странам
        const groupedCompetitions = data.competitions.reduce((acc, competition) => {
          const countryName = competition.area.name;
          if (!acc[countryName]) {
            acc[countryName] = {
              flag: competition.area.flag,
              competitions: []
            };
          }
          acc[countryName].competitions.push(competition);
          return acc;
        }, {});
        setCompetitionsByCountry(groupedCompetitions);
      } catch (err) {
        console.error("Ошибка при загрузке чемпионатов:", err);
        setError("Не удалось загрузить список чемпионатов.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фильтрация стран и чемпионатов по тексту поиска
  const filteredCompetitions = Object.entries(competitionsByCountry)
    .filter(([countryName, countryData]) => {
      // Если совпадает страна, включаем все её чемпионаты
      if (countryName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      // Если совпадают названия чемпионатов
      return countryData.competitions.some(competition =>
        competition.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .reduce((acc, [countryName, countryData]) => {
      // Если страна совпадает с поиском, оставляем все чемпионаты
      if (countryName.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[countryName] = countryData;
        return acc;
      }
      // Фильтруем чемпионаты внутри страны
      acc[countryName] = {
        ...countryData,
        competitions: countryData.competitions.filter(competition =>
          competition.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
      return acc;
    }, {});

  if (loading) return <p>Загрузка списка чемпионатов...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="championship-list">
      {/* Поле поиска */}
      <input
        type="text"
        placeholder="Поиск по стране или чемпионату..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Список чемпионатов */}
      {Object.entries(filteredCompetitions).map(([countryName, countryData]) => (
        <div className="country-block" key={countryName}>
          <div className="country-header">
            <img
              src={countryData.flag}
              alt={`${countryName} flag`}
              className="country-flag"
            />
            <h2>{countryName}</h2>
          </div>
          <div className="competitions-row">
            {countryData.competitions.map((competition) => (
              <Link
                to={`/tables/${competition.id}`}
                className="championship-item"
                key={competition.id}
              >
                <img
                  src={competition.emblem}
                  alt={`${competition.name} logo`}
                  className="championship-logo"
                />
                <span className="championship-name">{competition.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChampionshipList;