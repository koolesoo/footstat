import React, { useState, useEffect } from "react";
import { getMatchesByLeague } from "../services/api";

const LeagueMatches = ({ leagueId, date }) => {
  const [matches, setMatches] = useState([]); // Матчи
  const [loading, setLoading] = useState(true); // Загрузка матчей
  const [error, setError] = useState(null); // Ошибки

  // Загружаем матчи для выбранного чемпионата и даты
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const leagueMatches = await getMatchesByLeague(leagueId, date, date); // Получаем матчи для выбранного чемпионата
        setMatches(leagueMatches);
        console.log("Матчи для рендера:", leagueMatches); // Отладка
      } catch (err) {
        console.error("Ошибка при загрузке матчей:", err);
        setError("Не удалось загрузить матчи. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [leagueId, date]);

  if (loading) return <div>Загрузка матчей...</div>;
  if (error) return <div>{error}</div>;
  if (matches.length === 0) return <div>На выбранную дату матчей нет.</div>;

  return (
    <div>
      <h2>Матчи за {date}</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            <p>
              {match.homeTeam?.name || "Нет данных"} vs {match.awayTeam?.name || "Нет данных"} (
              {new Date(match.utcDate).toLocaleTimeString() || "Нет времени"})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeagueMatches;