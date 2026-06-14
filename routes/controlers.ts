import { db } from "../db";
const bcrypt = require("bcrypt");
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user: {
    id: number;
    username: string;
  };
}
const jwt = require("jsonwebtoken");



type UserToken = {
  id: number;
  username: string;
};

function generateToken(user: UserToken) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "24h",
    }
  );
}


const postUser = async (req: Request,
  res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const existingUser = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username`,
      [username, hashedPassword]
    );

    const user = result.rows[0];

    const accessToken = generateToken(user);

    res.status(201).json({
      accessToken,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const result = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );


    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken({
      id: user.id,
      username: user.username,
    });

    return res.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await db.query(
      `SELECT id,
              username,
              created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const addMovie = async (req: AuthRequest, res: Response) => {
  try {
    const { title, year, genre, poster_url, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const result = await db.query(
      `INSERT INTO movies (title, year, genre, poster_url, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, year || null, genre || null, poster_url || null, description || null, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getMovies = async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      `SELECT m.*, u.username AS added_by
       FROM movies m
       LEFT JOIN users u ON u.id = m.created_by
       ORDER BY m.created_at DESC`,
      []
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  postUser,
  loginUser,
  getProfile,
    addMovie,getMovies
};