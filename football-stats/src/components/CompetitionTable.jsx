import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStandingsByCompetition } from "../services/api"; // Метод для получения таблицы конкретного чемпионата

const CompetitionTable = () => {
  const { id } = useParams(); // Получаем ID чемпионата из URL
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const data = await getStandingsByCompetition(id); // Загружаем таблицу по ID
        setStandings(data.standings); // Предполагаем, что API возвращает поле `standings`
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
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Таблица чемпионата</h1>
      {standings.map((stage, index) => (
        <div key={index}>
          <h2>{stage.group || stage.stage}</h2>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Points</th>
                <th>Played</th>
                <th>Won</th>
                <th>Draw</th>
                <th>Lost</th>
              </tr>
            </thead>
            <tbody>
              {stage.table.map((team) => (
                <tr key={team.team.id}>
                  <td>{team.position}</td>
                  <td>{team.team.name}</td>
                  <td>{team.points}</td>
                  <td>{team.playedGames}</td>
                  <td>{team.won}</td>
                  <td>{team.draw}</td>
                  <td>{team.lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default CompetitionTable;