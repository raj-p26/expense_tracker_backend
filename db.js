import Database from "better-sqlite3";

const DB = new Database("expense_tracker.db");

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 */
export function insertUser(username, email, password) {
  const dbResult = DB.prepare(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
  ).run(username, email, password);

  return dbResult.lastInsertRowid;
}

/**
 * @param {string} email
 * @param {string} password
 */
export function checkCredentials(email, password) {
  return DB.prepare(
    "SELECT id, username, email FROM users WHERE email=? AND password=?"
  ).get(email, password);
}
