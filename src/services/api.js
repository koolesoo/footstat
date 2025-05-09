import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Базовый путь
  headers: {
    "X-Auth-Token": import.meta.env.VITE_FOOTBALL_DATA_API_KEY, // Токен для API
  },
});

// Получение списка стран и связанных с ними чемпионатов
export const getCountriesAndLeagues = async () => {
  try {
    const response = await api.get("/competitions"); // Получение всех доступных чемпионатов
    const competitions = response.data.competitions;

    // Группируем чемпионаты по странам
    const countriesAndLeagues = competitions.reduce((acc, competition) => {
      const country = competition.area.name; // Название страны
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push({
        id: competition.id,
        name: competition.name,
      });
      return acc;
    }, {});

    return countriesAndLeagues; // Возвращаем объект: { "CountryName": [ { id, name }, ... ] }
  } catch (error) {
    console.error("Ошибка при получении стран и чемпионатов:", error);
    throw error;
  }
};

// Получение таблицы для конкретного чемпионата
export const getTableForLeague = async (leagueId) => {
  try {
    const response = await api.get(`/competitions/${leagueId}/standings`);
    return {
      league: response.data.competition,
      season: response.data.season,
      standings: response.data.standings,
    }; // Возвращаем информацию о чемпионате и таблицах
  } catch (error) {
    console.error(`Ошибка при получении таблицы для лиги ${leagueId}:`, error);
    throw error;
  }
};
export const getStandingsByCompetition = async (competitionId) => {
  try {
    const response = await api.get(`/competitions/${competitionId}/standings`);
    return {
      league: response.data.competition, // Информация о чемпионате
      season: response.data.season, // Сезон
      standings: response.data.standings, // Таблица
    };
  } catch (error) {
    console.error(`Ошибка при получении таблицы для чемпионата ${competitionId}:`, error);
    throw error;
  }
};
export const getStandings = async () => {
  try {
    const response = await api.get("/competitions/standings");
    return response.data.standings; // Предполагаем, что API возвращает поле `standings`
  } catch (error) {
    console.error("Ошибка при получении таблиц чемпионатов:", error);
    throw error; // Пробрасываем ошибку для обработки
  }
};
export const getMatches = async (dateFrom, dateTo) => {
  try {
    const response = await api.get('/competitions/CL/matches', {
      params: {
        dateFrom,
        dateTo,
      },
    });
    return response.data.matches; 
  } catch (error) {
    console.error('Ошибка при получении матчей:', error.response?.data || error.message);
    throw error;
  }
};
export const getCompetitions = async () => {
  try {
    const response = await api.get("/competitions"); // Запрос списка чемпионатов
    return response.data; // Предполагаем, что ответ содержит объект с полем `competitions`
  } catch (error) {
    console.error("Ошибка при получении чемпионатов:", error);
    throw error; // Пробрасываем ошибку для обработки
  }
};
export const getMatchesByLeague = async (leagueId, dateFrom, dateTo) => {
  try {
    const response = await api.get(`/competitions/${leagueId}/matches`, {
      params: {
        dateFrom,
        dateTo,
      },
    });
    console.log(`Матчи для чемпионата ${leagueId}:`, response.data.matches); // Отладка
    return response.data.matches; // Возвращаем список матчей
  } catch (error) {
    console.error(`Ошибка при получении матчей для чемпионата ${leagueId}:`, error);
    throw error;
  }
};
export const getAllTeams = async () => {
  try {
    const response = await api.get("/teams"); // Запрос на эндпоинт всех команд
    return response.data.teams; // Предполагаем, что API возвращает поле `teams`
  } catch (error) {
    handleApiError(error, "Ошибка при получении всех команд:");
  }
};
export const getTeamDetails = async (teamId) => {
  const response = await axios.get(`${API_BASE_URL}/teams/${teamId}`);
  return {
    position: response.data.position, // Позиция в чемпионате
  };
};
export const getTeamMatches = async (teamId) => {
  const response = await axios.get(`${API_BASE_URL}/teams/${teamId}/matches`);
  const matches = response.data.matches;

  // Определяем последний и следующий матч
  const lastMatch = matches
    .filter((match) => new Date(match.utcDate) < new Date())
    .pop();
  const nextMatch = matches.find((match) => new Date(match.utcDate) > new Date());

  return { lastMatch, nextMatch };
};
export default api;