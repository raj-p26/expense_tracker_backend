import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import incomes from "./routes/incomes.js";

const app = express();

app.use(cors());
app.use("/auth", authRouter);

const server = app.listen(8000, () => {
  console.log("app listening on port 8000");
});

incomes(server);
