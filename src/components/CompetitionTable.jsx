import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStandingsByCompetition } from "../services/api";
import "./CompetitionTable.css";

const CompetitionTable = () => {
  const { id } = useParams();
  const [standings, setStandings] = useState(null);
  const [competitionName, setCompetitionName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const data = await getStandingsByCompetition(id);
        setStandings(data.standings || []);
        setCompetitionName(data.competition?.name || "Неизвестный чемпионат");
      } catch (err) {
        console.error("Ошибка при загрузке таблицы:", err);
        setError("Не удалось загрузить таблицу.");
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [id]);

  if (loading) return <p>Загрузка таблицы...</p>;

  if (error)
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );

  return (
    <div className="table-container">
      <h1 className="competition-title">{competitionName}</h1>
      {standings?.length > 0 ? (
        standings.map((stage, index) => (
          <div key={index}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Сыграно</th>
                  <th>Победы</th>
                  <th>Ничьи</th>
                  <th>Поражения</th>
                  <th>Очки</th>
                </tr>
              </thead>
              <tbody>
                {stage.table.map((team) => (
                  <tr key={team.team.id}>
                    <td>{team.position}</td>
                    <td className="team-cell">
                      <img
                        src={team.team.crest || "fallback-logo.png"}
                        alt={team.team.name}
                        className="team-logo"
                        onError={(e) => (e.target.src = "fallback-logo.png")}
                      />
                      {team.team.name}
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    <td className="bold">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>Нет данных для отображения.</p>
      )}
    </div>
  );
};

export default CompetitionTable;