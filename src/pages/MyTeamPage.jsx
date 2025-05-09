import React, { useState, useEffect } from "react";
import { getAllTeams } from "../services/api"; // Импорт правильного API-запроса
import "../components/MyTeamPage.css"; // Подключаем CSS
const MyTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [pinnedTeam, setPinnedTeam] = useState(null); // Хранит только одну закрепленную команду
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getAllTeams();
        setTeams(teamsData);
        setFilteredTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка при получении команд:", err);
        setError("Ошибка при загрузке команд. Попробуйте позже.");
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [search, teams]);

  // Обработчик закрепления команды
  const handlePinTeam = (team) => {
    setPinnedTeam((prevPinnedTeam) =>
      prevPinnedTeam && prevPinnedTeam.id === team.id ? null : team
    ); // Убираем или заменяем текущую закрепленную команду
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
  };

  if (loading) {
    return <div className="container">Загрузка команд...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <h2>Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (selectedTeam) {
    return (
      <div className="container team-banner">
        <h1>{selectedTeam.name}</h1>
        <img
          src={selectedTeam.crest}
          alt={`${selectedTeam.name} logo`}
        />
        <p>Адрес: {selectedTeam.address}</p>
        <p>Основан: {selectedTeam.founded}</p>
        <p>
          Официальный сайт:{" "}
          <a href={selectedTeam.website} target="_blank" rel="noopener noreferrer">
            {selectedTeam.website}
          </a>
        </p>
        <button onClick={() => setSelectedTeam(null)}>Вернуться к списку</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Список команд</h1>

      {/* Поле поиска */}
      <input
        type="text"
        className="search-input"
        placeholder="Поиск команды..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Блок для закрепленной команды */}
      {pinnedTeam && (
        <div className="pinned-team">
          <h2>Закрепленная команда</h2>
          <div className="pinned-team-card">
            <img src={pinnedTeam.crest} alt={`${pinnedTeam.name} logo`} />
            <p>{pinnedTeam.name}</p>
            <button
              onClick={() => handlePinTeam(pinnedTeam)} // Удаление закрепленной команды
              className="unpin-button"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {/* Список всех команд */}
      <ul className="team-list">
        {filteredTeams.map((team) => (
          <li key={team.id} className="team-list-item">
            <div
              className="team-container"
              onClick={() => handleSelectTeam(team)}
            >
              <img src={team.crest} alt={`${team.name} logo`} className="team-logo" />
              <p className="team-name">{team.name}</p>
            </div>
            <button
              className={`like-button ${
                pinnedTeam && pinnedTeam.id === team.id ? "liked" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePinTeam(team);
              }}
            >
              {pinnedTeam && pinnedTeam.id === team.id ? "♥" : "♡"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTeamsPage;