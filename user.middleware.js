import jwt from "jsonwebtoken";

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").Response} Response
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * @param {Request} req request object
 * @param {Response} res response object
 * @param {NextFunction} next request dispatcher
 */
export function verifyUser(req, res, next) {
  if (!req.headers["authorization"]) {
    res.status(401).send({ status: "failed", message: "You are unauthorized" });
    return;
  }

  const token = req.headers["authorization"];
  const payload = jwt.decode(token);
  if (!payload) {
    res.status(401).send({ status: "failed", message: "You are unauthorized" });
    return;
  }
  req.headers["user_id"] = payload;

  next();
}
