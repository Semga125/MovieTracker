import express from "express";

const router = express.Router();


const {
  postUser,
  loginUser,
  getProfile,
} = require("../routes/controlers");

const auth = require("../middleware/auth");

router.post("/register", postUser);

router.post("/login", loginUser);

router.get("/profile", auth, getProfile);

module.exports = router;