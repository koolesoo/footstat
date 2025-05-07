import React from "react";
import "./LiveScoreCard.css";

const LiveScoreCard = ({ match }) => {
  const { utcDate, homeTeam, awayTeam, score } = match;

  // Форматирование даты и времени
  const matchDate = new Date(utcDate);
  const formattedDate = matchDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
  const formattedTime = matchDate.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Проверяем, есть ли результат матча
  const homeScore = score.fullTime.home;
  const awayScore = score.fullTime.away;
  const isMatchPlayed = homeScore !== null && awayScore !== null;

  // Определяем победителя
  const getTeamClass = (teamType) => {
    if (!isMatchPlayed) return "team-name"; // Матч еще не начался
    if (teamType === "home" && homeScore > awayScore) return "team-name winner";
    if (teamType === "away" && awayScore > homeScore) return "team-name winner";
    return "team-name"; // Ничья или проигравшая команда
  };

  return (
    <div className="live-score-card">
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
          <span className={getTeamClass("home")}>
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
          <span className={getTeamClass("away")}>
            {awayTeam.shortName || awayTeam.name}
          </span>
          <span className="team-score">
            {isMatchPlayed ? awayScore : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreCard;