import React, { useEffect, useState } from 'react';
import { getMatches } from '../services/api';
import LiveScoreCard from '../components/LiveScoreCard';

const LiveScoresPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Получаем текущую дату в формате YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        const dateFrom = '2025-03-29';
        const dateTo = '2025-05-30'; 

        const data = await getMatches(dateFrom, dateTo);
        setMatches(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <p>Загрузка матчей...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <div>
        {matches.length > 0 ? (
          matches.map((match) => (
            <LiveScoreCard key={match.id} match={match} />
          ))
        ) : (
          <p>Нет матчей за указанный период.</p>
        )}
      </div>
    </div>
  );
};

export default LiveScoresPage;