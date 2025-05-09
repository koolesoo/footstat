import React, { useState, useEffect } from "react";
import { getMatchesByLeague } from "../services/api";
import "../components/LeagueMatches.css"; // Подключаем CSS

const LeagueMatches = ({ leagueId, date }) => {
  const [matches, setMatches] = useState([]); // Матчи
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Ошибки

  // Загрузка матчей
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const leagueMatches = await getMatchesByLeague(leagueId, date, date); // Получаем матчи
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

  // Определение CSS-классов для команд
  const getTeamClass = (teamType, homeScore, awayScore) => {
    if (homeScore === null || awayScore === null) return "team-name"; // Матч не сыгран
    if (teamType === "home" && homeScore > awayScore) return "team-name winner";
    if (teamType === "away" && awayScore > homeScore) return "team-name winner";
    return "team-name"; // Ничья или проигравшая команда
  };

  if (loading) return <div className="loading">Загрузка матчей...</div>;
  if (error) return <div className="error">{error}</div>;
  if (matches.length === 0) return <div className="no-matches">На выбранную дату матчей нет.</div>;

  return (
    <div className="league-matches-page">
      <h2 className="league-title">Матчи за {date}</h2>
      <div className="matches-container">
        {matches.map((match) => {
          const { utcDate, homeTeam, awayTeam, score } = match;

          // Форматирование времени и даты
          const matchDate = new Date(utcDate);
          const formattedDate = matchDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
          });
          const formattedTime = matchDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Проверяем, есть ли счет
          const homeScore = score.fullTime.home;
          const awayScore = score.fullTime.away;
          const isMatchPlayed = homeScore !== null && awayScore !== null;

          return (
            <div key={match.id} className="live-score-card">
              <div className="match-date-time">
                <span>{formattedDate}</span>
                <span>{formattedTime}</span>
              </div>

              {/* Разделитель */}
              <div className="divider"></div>

              {/* Команды и счет */}
              <div className="teams-container">
                {/* Домашняя команда */}
                <div className="team">
                  <img
                    src={homeTeam.crest}
                    alt={homeTeam.name}
                    className="team-logo"
                  />
                  <span className={getTeamClass("home", homeScore, awayScore)}>
                    {homeTeam.shortName || homeTeam.name}
                  </span>
                  <span className="team-score">
                    {isMatchPlayed ? homeScore : "-"}
                  </span>
                </div>

                {/* Гостевая команда */}
                <div className="team">
                  <img
                    src={awayTeam.crest}
                    alt={awayTeam.name}
                    className="team-logo"
                  />
                  <span className={getTeamClass("away", homeScore, awayScore)}>
                    {awayTeam.shortName || awayTeam.name}
                  </span>
                  <span className="team-score">
                    {isMatchPlayed ? awayScore : "-"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeagueMatches;