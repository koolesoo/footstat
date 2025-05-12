import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMatchesByLeague } from "../services/api";
import "../components/LeagueMatchesPage.css";

const LeagueMatchesPage = () => {
  const { leagueId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      // Устанавливаем таймаут для показа спиннера
      const spinnerTimeout = setTimeout(() => {
        setShowSpinner(true);
      }, 1000); // Показываем спиннер, если загрузка длится больше 1 секунды

      try {
        console.log(`Загружаем матчи для лиги ${leagueId} на дату ${date}`);
        const matches = await getMatchesByLeague(leagueId, date, date);
        setMatches(matches);
      } catch (err) {
        console.error("Ошибка при загрузке матчей:", err);
        setError("Не удалось загрузить матчи. Попробуйте позже.");
      } finally {
        clearTimeout(spinnerTimeout); // Убираем таймаут для спиннера
        setShowSpinner(false); // Прячем спиннер
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchMatches();
    }
  }, [leagueId, date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const formatTime = (utcDate) => {
    const matchDate = new Date(utcDate);
    return matchDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayResult = (match) => {
    const homeScore = match?.score?.fullTime?.home;
    const awayScore = match?.score?.fullTime?.away;

    if (
      homeScore === null ||
      awayScore === null ||
      homeScore === undefined ||
      awayScore === undefined
    ) {
      return formatTime(match.utcDate);
    }

    return `${homeScore} - ${awayScore}`;
  };

  if (loading) {
    return (
      <div className="league-matches-page">
        {showSpinner && (
          <div className="loading">
            <div className="spinner"></div>
            Загрузка матчей...
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="league-matches-page">
        <div className="error">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Обновить</button>
        </div>
      </div>
    );
  }

  return (
    <div className="league-matches-page">
      <h1 className="league-title">Матчи чемпионата</h1>

      <div className="date-picker">
        <label>
          Выберите дату:
          <input
            type="date"
            className="date-input"
            value={date}
            onChange={handleDateChange}
          />
        </label>
      </div>

      <div className="matches-container">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-details">
                <div className="team">
                  {match.homeTeam.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className="team-logo"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <span
                    className={`team-name ${
                      match.score?.winner === "HOME_TEAM" ? "winner" : ""
                    }`}
                  >
                    {match.homeTeam.name}
                  </span>
                </div>
                <div className="team">
                  {match.awayTeam.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className="team-logo"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <span
                    className={`team-name ${
                      match.score?.winner === "AWAY_TEAM" ? "winner" : ""
                    }`}
                  >
                    {match.awayTeam.name}
                  </span>
                </div>
              </div>
              <div className="match-info">
                <div className="match-result">{getDisplayResult(match)}</div>
                <div className="match-date">
                  {new Date(match.utcDate).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-matches">На выбранную дату матчей нет.</div>
        )}
      </div>
    </div>
  );
};

export default LeagueMatchesPage;