import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompetitions } from "../services/api"; // Импорт функции для получения списка чемпионатов
import "./ChampionshipList.css"; // Подключение CSS

const ChampionshipList = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCompetitions();
        setCompetitions(data.competitions);
      } catch (err) {
        console.error("Ошибка при загрузке чемпионатов:", err);
        setError("Не удалось загрузить список чемпионатов.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Загрузка списка стран и чемпионатов...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="championship-list">
      <h1>Список стран и чемпионатов</h1>
      {competitions.map((competition) => (
        <div className="country" key={competition.id}>
          <h2>{competition.area.name}</h2>
          <ul>
            <li>
              <Link to={`/tables/${competition.id}`}>{competition.name}</Link>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChampionshipList;