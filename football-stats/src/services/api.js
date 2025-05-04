import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  headers: {
    'X-Auth-Token': import.meta.env.VITE_FOOTBALL_DATA_API_KEY, 
  },
});

// Получение матчей за указанный период
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
// Получение таблиц чемпионатов
export const getStandings = async () => {
  try {
    const response = await api.get("/competitions"); // Получение всех доступных чемпионатов
    const competitions = response.data.competitions;

    // Загружаем таблицы для каждого чемпионата
    const standingsPromises = competitions.map(async (competition) => {
      try {
        const standingsResponse = await api.get(`/competitions/${competition.id}/standings`);
        return {
          competition,
          season: standingsResponse.data.season,
          standings: standingsResponse.data.standings,
        };
      } catch (err) {
        console.error(`Ошибка при получении таблицы для чемпионата ${competition.name}:`, err);
        return null;
      }
    });

    const standingsData = await Promise.all(standingsPromises);
    return standingsData.filter((standing) => standing !== null); // Фильтруем успешные запросы
  } catch (error) {
    console.error("Ошибка при получении чемпионатов:", error);
    throw error;
  }
};
export default api;