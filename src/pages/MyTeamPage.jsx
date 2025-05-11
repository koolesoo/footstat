import React, { useState, useEffect, useRef } from "react";
import {
  getAllTeams,
  getStandingsByCompetition,
} from "../services/api";
import TabBar from "../components/TabBar"; // Импорт TabBar
import "../components/MyTeamPage.css";

const MyTeamsPage = () => {
  const [teams, setTeams] = useState([]); // Все команды
  const [filteredTeams, setFilteredTeams] = useState([]); // Отфильтрованные команды
  const [search, setSearch] = useState(""); // Поисковый запрос
  const [pinnedTeam, setPinnedTeam] = useState(null); // Закреплённая команда
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки
  const [teamCompetitions, setTeamCompetitions] = useState([]); // Места команды в чемпионатах

  const pinnedTeamRef = useRef(null); // Референс для автоскролла к закреплённой карточке

  // Получение всех команд
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getAllTeams();
        setTeams(teamsData);
        setFilteredTeams(teamsData);
        setLoading(false);

        // Проверяем, есть ли закреплённая команда в localStorage
        const savedTeam = localStorage.getItem("pinnedTeam");
        if (savedTeam) {
          const parsedTeam = JSON.parse(savedTeam);
          const foundTeam = teamsData.find((team) => team.id === parsedTeam.id);
          if (foundTeam) {
            setPinnedTeam(foundTeam);
          }
        }
      } catch (err) {
        console.error("Ошибка при получении команд:", err);
        setError("Ошибка при загрузке команд. Попробуйте позже.");
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Фильтрация команд по поисковому запросу
  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [search, teams]);

  // Загрузка информации о местах команды в чемпионатах
  useEffect(() => {
    const fetchTeamCompetitions = async () => {
      if (!pinnedTeam) {
        setTeamCompetitions([]); // Сбрасываем данные, если нет закреплённой команды
        return;
      }

      try {
        const competitions = pinnedTeam.runningCompetitions || []; // Берём все чемпионаты команды
        const competitionDetails = [];

        // Проходим по всем чемпионатам команды
        for (const competition of competitions) {
          const standingsData = await getStandingsByCompetition(competition.id);
          const standings = standingsData.standings[0]?.table || [];

          // Ищем команду в таблице чемпионата
          const teamStanding = standings.find(
            (entry) => entry.team.id === pinnedTeam.id
          );

          competitionDetails.push({
            competitionName: competition.name,
            position: teamStanding ? teamStanding.position : "Неизвестно",
            points: teamStanding ? teamStanding.points : 0,
          });
        }

        setTeamCompetitions(competitionDetails);

        // Скроллим к закреплённой карточке
        pinnedTeamRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (err) {
        console.error("Ошибка при получении мест команды в чемпионатах:", err);
      }
    };

    fetchTeamCompetitions();
  }, [pinnedTeam]);

  // Обработчик закрепления команды
  const handlePinTeam = (team) => {
    const newPinnedTeam = pinnedTeam && pinnedTeam.id === team.id ? null : team;
    setPinnedTeam(newPinnedTeam);

    // Сохраняем или удаляем закреплённую команду в localStorage
    if (newPinnedTeam) {
      localStorage.setItem("pinnedTeam", JSON.stringify(newPinnedTeam));
    } else {
      localStorage.removeItem("pinnedTeam");
    }
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

  return (
    <>
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

        {/* Блок для закреплённой команды */}
        {pinnedTeam && (
          <div className="pinned-team" ref={pinnedTeamRef}>
            <h2>Закреплённая команда</h2>
            <div className="pinned-team-card">
              <img src={pinnedTeam.crest} alt={`${pinnedTeam.name} logo`} />
              <div className="team-info">
                <h3>{pinnedTeam.name}</h3>

                {/* Места команды в чемпионатах */}
                <h4>Места в чемпионатах:</h4>
                <ul>
                  {teamCompetitions.map((competition, index) => (
                    <li key={index}>
                      <strong>{competition.competitionName}:</strong>{" "}
                      Позиция {competition.position} ({competition.points} очков)
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handlePinTeam(pinnedTeam)}
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
                onClick={() => handlePinTeam(team)}
              >
                <img
                  src={team.crest}
                  alt={`${team.name} logo`}
                  className="team-logo"
                />
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

      {/* TabBar с передачей логотипа закреплённой команды */}
      <TabBar likedTeamLogo={pinnedTeam?.crest} />
    </>
  );
};

export default MyTeamsPage;