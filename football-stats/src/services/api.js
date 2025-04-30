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

export default api;