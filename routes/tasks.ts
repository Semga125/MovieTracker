import express from "express";

const router = express.Router();


const {
  postUser,
  loginUser,
  getProfile,
  addMovie,
  getMovies,
  deleteMovie,
  getFavorites,
  toggleFavorite
} = require("../routes/controlers");

const auth = require("../middleware/auth");

router.post("/register", postUser);

router.post("/login", loginUser);

router.get("/profile", auth, getProfile);
router.post("/movies", auth, addMovie);
router.get("/movies", auth, getMovies);
router.delete("/movies/:id", auth, deleteMovie);
router.get("/movies/favorites", auth, getFavorites);
router.post("/movies/:id/favorite", auth, toggleFavorite);

module.exports = router;