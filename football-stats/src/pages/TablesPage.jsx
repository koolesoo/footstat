
import React, { useEffect, useState } from "react";
import { getStandings } from "../services/api"; // Импорт метода API
import "../components/TablesCard";


const TablesPage = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStandings();
        setStandings(data);
      } catch (err) {
        console.error("Ошибка при загрузке таблиц:", err);
        setError("Не удалось загрузить таблицы.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTable = (standing) => (
    <div key={standing.competition.id} className="table-container">
      <h2>{standing.competition.name}</h2>
      {standing.standings.map((stage, index) => (
        <div key={index}>
          <h3>{stage.group || stage.stage}</h3>
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

  return (
    <div className="tables-page">
      {loading && <p>Загрузка таблиц...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && standings.map(renderTable)}
    </div>
  );
};

export default TablesPage;