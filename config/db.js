import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения из .env

const { Pool } = pg;

// Настройка подключения к базе данных
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Функция для создания таблицы
const createTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,         -- Уникальный идентификатор
          username VARCHAR(50) NOT NULL, -- Имя пользователя
          password VARCHAR(255) NOT NULL,-- Пароль
          points INT DEFAULT 0           -- Очки (по умолчанию 0)
      );
    `;
    await pool.query(query);
    console.log('Таблица users успешно создана!');
  } catch (err) {
    console.error('Ошибка при создании таблицы:', err.stack);
  }
};

// Основная функция для настройки базы данных
const setupDatabase = async () => {
  try {
    await createTable(); // Создаём таблицу
  } catch (err) {
    console.error('Ошибка при настройке базы данных:', err.stack);
  } finally {
    await pool.end(); // Закрываем пул соединений
  }
};

// Запуск настройки базы данных
setupDatabase();

export default pool;