import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const userRouter = require("./routes/tasks");

import "./db";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/users", userRouter);
app.use("/uploads", express.static("uploads"));


app.get("/", (_req, res) => {
  res.send("Server is running ");
});
  

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});