import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { allIncomes } from "../db.js";

config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @param {import("http").Server<any, any>} httpServer
 */
export default (httpServer) => {
  console.log("creating ws");
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost",
      methods: ["GET", "POST"],
    },
  });
  const incomesWS = io.of("/incomes");

  incomesWS.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }
    socket.data["user_id"] = jwt.decode(token, JWT_SECRET).id;
    next();
  });

  incomesWS.on("connect", (socket) => {
    const res = allIncomes(socket.data["user_id"]);

    io.emit("initial data", res);
  });
};
