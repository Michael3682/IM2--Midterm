const db = require("../config/db");
const generateUUID = require("../utils/generateUUID");

const createUserTable = async () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS users(
        id varchar(50) PRIMARY KEY,
        name varchar(100) NOT NULL,
        email varchar(100) UNIQUE NOT NULL,
        password varchar(100) NOT NULL,
        resetToken varchar(100),
        resetTokenExpiry bigint
        )
    `;

  await db.query(sql);
};

const findUserByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();

  const user = await db.query(`SELECT * FROM users WHERE email = ?`, [
    normalized,
  ]);

  return user[0];
};

const createUser = async (name, email, password) => {
  const id = generateUUID();

  const user = await db.query(
    `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
    [id, name, email, password]
  );

  return user;
};

const setResetToken = async (email, token, expiry) => {
  const result = await db.query(
    'UPDATE users SET resetRoken = ?, resetTokenExpiry = ? WHERE email = ?',
    [token, expiry, email]
  );

  return result;
}

const findUserByResetToken = async (token) => {
  const user = await db.query(`SELECT * FROM users WHERE resetToken = ?`, 
    [token]
  );

  return user[0];
}

const updatePassword = async (email, newPassword) => {
  const result = await db.query(
    'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE email = ?',
    [newPassword, email]
  );

  return result;
}

const saveOnboardingInfo = async (userId, name, bio, avatar) => {
  const sql = 'UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?';
  const result = await db.query(sql, [name, bio, avatar, userId]);
  return result;
};

module.exports = { createUserTable, findUserByEmail, createUser, setResetToken, findUserByResetToken, updatePassword, saveOnboardingInfo };
