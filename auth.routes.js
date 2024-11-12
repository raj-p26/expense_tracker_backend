import { Router } from "express";
import * as db from "./db.js";
import { hash } from "crypto";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET;

const authRouter = Router();

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 */

/**
 * Register thing.
 *
 * @param {Request} req
 * @param {Response} res
 */
async function registerUser(req, res) {
  const { body } = req;
  const dbResult = db.insertUser(
    body.username,
    body["email"],
    hash("sha1", body["password"])
  );

  const token = jwt.sign(
    {
      username: body["username"],
      email: body["email"],
      id: dbResult,
    },
    JWT_SECRET
  );

  res.send({ status: "done", token });
}

/**
 * Login thing.
 *
 * @param {Request} req
 * @param {Response} res
 */
async function authenticate(req, res) {
  const { body } = req;
  const dbResult = db.checkCredentials(
    body["email"],
    hash("sha1", body["password"])
  );

  if (dbResult) {
    const token = jwt.sign(
      {
        ...dbResult,
      },
      JWT_SECRET
    );
    res.send({ status: "done", token });
  } else {
    res.status(401).send({ status: "failed", message: "Unauthorized" });
  }
}

authRouter.post("/register", registerUser);
authRouter.post("/login", authenticate);

export default authRouter;
