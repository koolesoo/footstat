import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMatchesByLeague } from "../services/api";
import "../components/LeagueMatchesPage.css";

const LeagueMatchesPage = () => {
  const { leagueId } = useParams();
  const [matches, setMatches] = useState([]); // Список матчей
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибки
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]); // Текущая дата

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMatchesByLeague(leagueId); // Загружаем матчи
        // Фильтруем матчи по выбранной дате
        const filteredMatches = data.filter((match) =>
          match.utcDate.startsWith(date)
        );
        setMatches(filteredMatches);
      } catch (err) {
        console.error("Ошибка при загрузке матчей:", err);
        setError("Не удалось загрузить матчи. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId, date]); // Перезагрузка при изменении даты или лиги

  const handleDateChange = (event) => {
    setDate(event.target.value); // Обновляем выбранную дату
  };

  if (loading) return <div className="loading">Загрузка матчей...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="league-matches-page">
      <h1 className="league-title">Матчи лиги</h1>

      {/* Выбор даты */}
      <label className="date-picker">
        Выберите дату:
        <input type="date" value={date} onChange={handleDateChange} />
      </label>

      <div className="matches-container">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="team-names">
                <span className="team home-team">{match.homeTeam.name}</span>
                <span className="vs">vs</span>
                <span className="team away-team">{match.awayTeam.name}</span>
              </div>
              <div className="match-info">
                {match.status === "FINISHED" ? (
                  <span className="score">
                    {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}
                  </span>
                ) : (
                  <span className="match-time">{match.utcDate}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-matches">На выбранную дату матчей нет.</p>
        )}
      </div>
    </div>
  );
};

export default LeagueMatchesPage;