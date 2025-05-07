import pool from './db.js';

// Функция для изменения очков пользователя
const updatePoints = async (username, points) => {
  try {
    const query = `
      UPDATE users
      SET points = $1
      WHERE username = $2
      RETURNING *;
    `;
    const values = [points, username];
    const res = await pool.query(query, values);
    if (res.rows.length > 0) {
      console.log('Очки пользователя обновлены:', res.rows[0]);
    } else {
      console.log('Пользователь не найден.');
    }
  } catch (err) {
    console.error('Ошибка при обновлении очков:', err.stack);
  } // Убираем вызов pool.end()
};

// Обновляем очки пользователя
updatePoints('test_user', 150);