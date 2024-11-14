import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import authRouter from "./routes/auth.js";
import { JWT_SECRET } from "./constants.js";
import {
  addExpense,
  allExpenses,
  deleteExpense,
  getExpenseByID,
  updateExpense,
  allIncomes,
  addIncome,
  deleteIncome,
  getIncomeByID,
  updateIncome,
} from "./db.js";

const app = express();
const userSockets = {};

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

const server = app.listen(8000, () => {
  console.log("app listening on port 8000");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
  },
});

const expensesWS = io.of("/expenses");

expensesWS.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Unauthorized"));
    return;
  }

  const decoded = jwt.decode(token, JWT_SECRET);
  if (!decoded) {
    next(new Error("Unauthorized"));
    return;
  }

  socket.data["user_id"] = decoded;
  next();
});

expensesWS.on("connect", (socket) => {
  const userID = socket.data["user_id"];
  const res = allExpenses(userID);
  if (!userSockets[userID]) userSockets[userID] = new Set();

  userSockets[userID].add(socket);

  socket.emit("initial data", res);

  socket.on("expenses:add", (data) => {
    const dbResult = addExpense({ ...data, user_id: socket.data["user_id"] });
    if (dbResult.changes > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("expenses:append", {
          ...data,
          id: dbResult.lastInsertRowid,
        });
      });
    }
  });

  socket.on("expenses:delete", (expenseID) => {
    const dbResult = deleteExpense(expenseID, socket.data["user_id"]);
    if (dbResult > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("expense:deleted", expenseID);
      });
    }
  });

  socket.on("expenses:update", (data) => {
    const dbResult = updateExpense(data);

    if (dbResult.changes > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("expense:updated", data);
      });
    }
  });

  socket.on("expenses:get", (id) => {
    const expense = getExpenseByID(id);

    userSockets[userID].forEach((sock) => {
      sock.emit("expense:get", expense);
    });
  });
});

const incomesWS = io.of("/incomes");

incomesWS.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Unauthorized"));
    return;
  }

  const decoded = jwt.decode(token, JWT_SECRET);
  if (!decoded) {
    next(new Error("Unauthorized"));
    return;
  }

  socket.data["user_id"] = decoded;
  next();
});

incomesWS.on("connect", (socket) => {
  const userID = socket.data["user_id"];
  const res = allIncomes(userID);
  if (!userSockets[userID]) userSockets[userID] = new Set();

  userSockets[userID].add(socket);

  socket.emit("initial data", res);

  socket.on("incomes:add", (data) => {
    const dbResult = addIncome({ ...data, user_id: socket.data["user_id"] });
    if (dbResult.changes > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("incomes:append", {
          ...data,
          id: dbResult.lastInsertRowid,
        });
      });
    }
  });

  socket.on("incomes:delete", (incomeID) => {
    const dbResult = deleteIncome(incomeID, socket.data["user_id"]);
    if (dbResult > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("income:deleted", incomeID);
      });
    }
  });

  socket.on("incomes:update", (data) => {
    const dbResult = updateIncome(data);

    if (dbResult.changes > 0) {
      userSockets[userID].forEach((sock) => {
        sock.emit("income:updated", data);
      });
    }
  });

  socket.on("incomes:get", (id) => {
    const income = getIncomeByID(id);

    userSockets[userID].forEach((sock) => {
      sock.emit("income:get", income);
    });
  });
});
