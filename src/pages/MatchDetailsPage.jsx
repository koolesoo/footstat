import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // Используем существующий API-клиент

const MatchDetailsPage = () => {
  const { matchId } = useParams(); // Извлекаем ID матча из URL
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/matches/${matchId}`); // Запрос к API
        setMatch(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных матча:", err);
        setError("Не удалось загрузить данные матча.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (loading) return <div>Загрузка деталей матча...</div>;
  if (error) return <div>{error}</div>;
  if (!match) return <div>Данные о матче не найдены.</div>;

  const { homeTeam, awayTeam, score, utcDate } = match;

  return (
    <div>
      <h1>
        {homeTeam.name} vs {awayTeam.name}
      </h1>
      <p>Дата матча: {new Date(utcDate).toLocaleString()}</p>
      <p>
        Счёт: {score.fullTime.home} - {score.fullTime.away}
      </p>
      <p>Победитель: {score.winner || "Нет данных"}</p>
    </div>
  );
};

export default MatchDetailsPage;