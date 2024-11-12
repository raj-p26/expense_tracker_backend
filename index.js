import express from "express";
import cors from "cors";
import authRouter from "./auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(8000, () => {
  console.log("app listening on port 8000");
});
