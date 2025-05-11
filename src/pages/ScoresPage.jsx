// ScoresPage.jsx - почти полная копия ChampionshipList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Изменено с Link на useNavigate
import { getCompetitions } from "../services/api";
import "../components/ScoresPageCard.css"; // Переименованный CSS файл

const ScoresPage = () => {
  const [competitionsByCountry, setCompetitionsByCountry] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Используем навигацию

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCompetitions();
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

  // Фильтрация (остаётся без изменений)
  const filteredCompetitions = Object.entries(competitionsByCountry)
    .filter(([countryName, countryData]) => {
      if (countryName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      return countryData.competitions.some(competition =>
        competition.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .reduce((acc, [countryName, countryData]) => {
      if (countryName.toLowerCase().includes(searchQuery.toLowerCase())) {
        acc[countryName] = countryData;
        return acc;
      }
      acc[countryName] = {
        ...countryData,
        competitions: countryData.competitions.filter(competition =>
          competition.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
      return acc;
    }, {});

  // Единственное изменение - путь при клике
  const handleCompetitionClick = (competitionId) => {
    navigate(`/matches/${competitionId}`); // Было /tables/${competitionId}
  };

  if (loading) return <p>Загрузка списка чемпионатов...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="championship-list">
      <input
        type="text"
        placeholder="Поиск по стране или чемпионату..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

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
              <div
                key={competition.id}
                className="championship-item"
                onClick={() => handleCompetitionClick(competition.id)} // Изменён обработчик
              >
                <img
                  src={competition.emblem}
                  alt={`${competition.name} logo`}
                  className="championship-logo"
                />
                <span className="championship-name">{competition.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoresPage;