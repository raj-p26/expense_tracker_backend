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
 * @returns {number | bigint} ID of the user
 */
export function checkCredentials(email, password) {
  return DB.prepare("SELECT id FROM users WHERE email=? AND password=?").get(
    email,
    password
  );
}

/**
 * @param {string} userID ID of the user
 * @returns {{income_type: string; income_amount: string; income_description: string; income_date: string;}[]} an array containing all incomes of the user
 */
export function allIncomes(userID) {
  return DB.prepare(
    "SELECT income_type, income_amount, income_description, income_date FROM incomes WHERE user_id=?"
  ).all(userID);
}
