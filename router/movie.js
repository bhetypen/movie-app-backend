const express = require("express");
const router = express.Router();
const { verify, verifyAdmin} = require("../auth");
const { addMovie, updateMovie, deleteMovie, getAllMovies, getMovieById, addMovieComment, getMovieComments} = require("../controllers/movie");




// user only endpoint
router.patch("/addComment/:id", verify, addMovieComment)
router.get('/getComments/:id', verify, getMovieComments)


//Public endpoint
router.get("/getMovies", getAllMovies)
router.get("/getMovie/:id", getMovieById)

// Admin-only endpoint
router.post("/addMovie", verify, verifyAdmin, addMovie);

router.patch("/updateMovie/:id", verify, verifyAdmin, updateMovie)
router.delete("/deleteMovie/:id", verify, verifyAdmin, deleteMovie)



module.exports = router;
