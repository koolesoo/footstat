import React, { useState, useEffect, useRef } from "react";
import { getAllTeams, getStandingsByCompetition } from "../services/api";
import { useAuth } from "../context/AuthContext";
import TabBar from "../components/TabBar";
import "../components/MyTeamPage.css";

const MyTeamsPage = () => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [pinnedTeam, setPinnedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamCompetitions, setTeamCompetitions] = useState([]);

  const pinnedTeamRef = useRef(null);

  // Получение всех команд и закрепленной команды пользователя
  useEffect(() => {
    const fetchTeamsAndFavorite = async () => {
      try {
        // Загружаем все команды
        const teamsData = await getAllTeams();
        setTeams(teamsData);
        setFilteredTeams(teamsData);

        // Если пользователь авторизован, загружаем его любимую команду
        if (currentUser) {
          const response = await fetch(
            `http://localhost:5001/api/fav-team/${currentUser.id}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.team_id) {
              const favoriteTeam = teamsData.find(
                (team) => team.id === data.team_id
              );
              if (favoriteTeam) {
                setPinnedTeam(favoriteTeam);
              }
            }
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Ошибка при загрузке данных. Попробуйте позже.");
        setLoading(false);
      }
    };

    fetchTeamsAndFavorite();
  }, [currentUser]);

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
        setTeamCompetitions([]);
        return;
      }

      try {
        const competitions = pinnedTeam.runningCompetitions || [];
        const competitionDetails = [];

        for (const competition of competitions) {
          const standingsData = await getStandingsByCompetition(competition.id);
          const standings = standingsData.standings[0]?.table || [];

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
        pinnedTeamRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (err) {
        console.error("Ошибка при получении мест команды:", err);
      }
    };

    fetchTeamCompetitions();
  }, [pinnedTeam]);

  // Обработчик закрепления/открепления команды
  const handlePinTeam = async (team) => {
    if (!currentUser) {
      alert("Для выбора любимой команды необходимо войти в систему");
      return;
    }

    try {
      // Если команда уже закреплена - открепляем
      if (pinnedTeam && pinnedTeam.id === team.id) {
        await fetch("http://localhost:5001/api/fav-team", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            team_id: team.id,
            team_name: team.name,
          }),

        });
        setPinnedTeam(null);
      } else {
        // Иначе закрепляем новую команду
        const response = await fetch("http://localhost:5001/api/fav-team", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            team_id: team.id,
            team_name: team.name,
          }),
        });

        if (response.ok) {
          setPinnedTeam(team);
        } else {
          throw new Error("Ошибка сохранения команды");
        }
      }
    } catch (err) {
      console.error("Ошибка при обновлении любимой команды:", err);
      setError("Не удалось сохранить выбор команды");
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
        <h1>Моя команда</h1>

        <input
          type="text"
          className="search-input"
          placeholder="Поиск команды..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {pinnedTeam && (
          <div className="pinned-team" ref={pinnedTeamRef}>
            <h2>Ваша любимая команда</h2>
            <div className="pinned-team-card">
              <img src={pinnedTeam.crest} alt={`${pinnedTeam.name} logo`} />
              <div className="team-info">
                <h3>{pinnedTeam.name}</h3>
                <h4>Места в чемпионатах:</h4>
                <ul>
                  {teamCompetitions.map((competition, index) => (
                    <li key={index}>
                      <strong>{competition.competitionName}:</strong> Позиция{" "}
                      {competition.position} ({competition.points} очков)
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handlePinTeam(pinnedTeam)}
                className="unpin-button"
              >
                Изменить выбор
              </button>
            </div>
          </div>
        )}

        <h2>Все команды</h2>
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
                aria-label={
                  pinnedTeam && pinnedTeam.id === team.id
                    ? "Удалить из избранного"
                    : "Добавить в избранное"
                }
              >
                {pinnedTeam && pinnedTeam.id === team.id ? "♥" : "♡"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <TabBar likedTeamLogo={pinnedTeam?.crest} />
    </>
  );
};

export default MyTeamsPage;