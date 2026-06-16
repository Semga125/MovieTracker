import express from "express";

const router = express.Router();


const {
  postUser,
  loginUser,
  getProfile,
  addMovie,getMovies,deleteMovie
} = require("../routes/controlers");

const auth = require("../middleware/auth");

router.post("/register", postUser);

router.post("/login", loginUser);

router.get("/profile", auth, getProfile);
router.post("/movies", auth, addMovie);
router.get("/movies", auth, getMovies);
router.delete("/movies/:id", auth, deleteMovie);

module.exports = router;