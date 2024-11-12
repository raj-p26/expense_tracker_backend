import { Router } from "express";
import * as db from "./db.js";
import { hash } from "crypto";

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

  res.send({ status: "done", dbResult });
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
    res.send({ status: "done", ...dbResult });
  } else {
    res.status(401).send({ status: "undone lol", message: "Unauthorized" });
  }
}

authRouter.post("/register", registerUser);
authRouter.post("/login", authenticate);

export default authRouter;
