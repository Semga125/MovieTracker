import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const auth = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send("No token");
  }

  const token = header.split(" ")[1];

  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_SECRET
    );

    req.user = user;

    next();
  } catch {
    return res.status(403).send("Invalid token");
  }
};

module.exports = auth;