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
 * @returns {{id: number | bigint; username: string;}} ID of the user
 */
export function checkCredentials(email, password) {
  return DB.prepare(
    "SELECT id, username FROM users WHERE email=? AND password=?"
  ).get(email, password);
}

/**
 * @param {string} userID ID of the user
 * @returns {{
 * income_type:string;
 * income_amount:string;
 * income_description:string;
 * income_date:string;
 * }[]} an array containing all incomes of the user
 */
export function allIncomes(userID) {
  return DB.prepare(
    "SELECT id, income_type, income_amount, income_description, income_date FROM incomes WHERE user_id=?"
  ).all(userID);
}

/**
 * @param {{
 * income_type:string;
 * income_amount:string;
 * income_description:string;
 * income_date:Date;
 * user_id:string;
 * }} param0
 * @returns {{lastInsertRowid: int | bigint; changes: int}}
 */
export function addIncome({
  income_type,
  income_amount,
  income_description,
  income_date,
  user_id,
}) {
  return DB.prepare(
    "INSERT INTO incomes (income_type, income_amount, income_description, income_date, user_id) VALUES (?, ?, ?, ?, ?)"
  ).run(income_type, income_amount, income_description, income_date, user_id);
}

/**
 * @param {string} incomeID ID of the income
 * @param {string} userID ID of the user
 * @returns db rows affected
 */
export function deleteIncome(incomeID, userID) {
  return DB.prepare("DELETE FROM incomes WHERE id=? AND user_id=?").run(
    incomeID,
    userID
  ).changes;
}

/**
 * @param {string} id ID of the income
 * @returns {{
 * income_type:string;
 * income_amount:string;
 * income_description:string;
 * income_date:string;
 * }}
 */
export function getIncomeByID(id) {
  return DB.prepare(
    `SELECT id, income_type, income_amount, income_description, income_date FROM incomes WHERE id=?`
  ).get(id);
}

export function updateIncome(income) {
  return DB.prepare(
    `UPDATE incomes SET income_type=?, income_amount=?, income_description=?, income_date=? WHERE id=?`
  ).run(
    income.income_type,
    income.income_amount,
    income.income_description,
    income.income_date,
    income.id
  );
}

/**
 * @param {string} userID ID of the user
 * @returns {{
 * id:string;
 * expense_type:string;
 * expense_amount:string;
 * expense_description:string;
 * expense_date:string;
 * }[]}
 */
export function allExpenses(userID) {
  return DB.prepare(
    "SELECT id, expense_type, expense_amount, expense_description, expense_date FROM expenses WHERE user_id=?"
  ).all(userID);
}

/**
 * @param {{
 * expense_type:string;
 * expense_amount:string;
 * expense_description:string;
 * expense_date:Date;
 * user_id:string;
 * }} param0
 * @returns {{lastInsertRowid: int | bigint; changes: int}}
 */
export function addExpense({
  expense_type,
  expense_amount,
  expense_description,
  expense_date,
  user_id,
}) {
  return DB.prepare(
    "INSERT INTO expenses (expense_type, expense_amount, expense_description, expense_date, user_id) VALUES (?, ?, ?, ?, ?)"
  ).run(
    expense_type,
    expense_amount,
    expense_description,
    expense_date,
    user_id
  );
}

/**
 * @param {string} expenseID ID of the expense
 * @param {string} userID ID of the user
 * @returns db rows affected
 */
export function deleteExpense(expenseID, userID) {
  return DB.prepare("DELETE FROM expenses WHERE id=? AND user_id=?").run(
    expenseID,
    userID
  ).changes;
}

/**
 * @param {string} id ID of the expense
 * @returns {{
 * expense_type:string;
 * expense_amount:string;
 * expense_description:string;
 * expense_date:string;
 * }}
 */
export function getExpenseByID(id) {
  return DB.prepare(
    `SELECT id, expense_type, expense_amount, expense_description, expense_date FROM expenses WHERE id=?`
  ).get(id);
}

export function updateExpense(expense) {
  return DB.prepare(
    `UPDATE expenses SET expense_type=?, expense_amount=?, expense_description=?, expense_date=? WHERE id=?`
  ).run(
    expense.expense_type,
    expense.expense_amount,
    expense.expense_description,
    expense.expense_date,
    expense.id
  );
}
