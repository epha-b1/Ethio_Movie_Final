const router = require("express").Router();
const Movie = require("../models/Movie");
const User = require('../models/User');

const verify = require("../verifyToken");
const axios = require("axios");

// CREATE
router.post("/", verify, async (req, res) => {
  try {
    // Make an API call to fetch the user's role
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the user is either an Admin or a Content Creator
    if (roleName === "Admin" || roleName === "Content_Creator") {
      const newMovie = new Movie({
        ...req.body,
        uploadedBy: req.user.id, // Associate the movie with the authenticated user
      });
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } else {
      res.status(403).json("You are not allowed to upload movies");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    // Fetch the movie by ID
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;

    // Check if the authenticated user is the uploader or an admin
    if (roleName === "Admin" || req.user.id === movie.uploadedBy.toString()) {
      // Update the movie
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } else {
      res.status(403).json("You are not allowed to update this movie");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    // Fetch the movie by ID
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;
    // Check if the authenticated user is the uploader or an admin
    if (roleName === "Admin" || req.user.id === movie.uploadedBy.toString()) {
      // Delete the movie
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } else {
      res.status(403).json("You are not allowed to delete this movie");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET RANDOM
router.get("/random", verify, async (req, res) => {
  try {
    const type = req.query.type;
    const movie = await Movie.aggregate([
      { $match: { isSeries: type === "series" } },
      { $sample: { size: 1 } },
    ]);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", verify, async (req, res) => {
  try {
    const roleRes = await axios.get(
      `http://localhost:8800/api/role/${req.user.role}`
    );
    const roleName = roleRes.data.role_name;
    if (roleName === "Admin" || roleName === "Content_Creator") {
      let movies;
      if (roleName === "Admin") {
        // If the user is an admin, retrieve all movies
        movies = await Movie.find().sort({ _id: -1 });
      } else {
        // If the user is a content creator, retrieve movies uploaded by the creator
        movies = await Movie.find({ uploadedBy: req.user.id }).sort({
          _id: -1,
        });
      }
      res.status(200).json(movies);
    } else {
      res.status(403).json("You are not allowed!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/allMovie", async (req, res) => {
  try {
    movies = await Movie.find().sort({ _id: -1 });

    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update view count for a movie
// router.post("/:id/views", async (req, res) => {
//   try {
//     const movieId = req.params.id;
//     const movie = await Movie.findById(movieId);
//     if (!movie) {
//       return res.status(404).json({ message: "Movie not found" });
//     }
//     movie.views += 1;
//     await movie.save();
//     res.json({ message: "View count updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/:id/views", verify, async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user.id; // Assuming the user's ID is provided in the request user object

    // Validate movie ID and user ID
    if (!movieId || !userId) {
      return res.status(400).json({ message: 'Missing movie ID or user ID' });
    }

    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Ensure that the views array is initialized
    movie.views = movie.views || [];

    // Check if the user has already viewed the movie
    if (movie.views && movie.views.length > 0) {
      const viewerIndex = movie.views.findIndex(view => view.user && view.user.toString() === userId);
      if (viewerIndex !== -1) {
        // If the user has already viewed the movie, increment their view count
        movie.views[viewerIndex].count += 1;
      } else {
        // If the user hasn't viewed the movie yet, add them to the views array
        movie.views.push({ user: userId, count: 1 });
      }
    } else {
      // If no views exist yet, add the user to the views array
      movie.views.push({ user: userId, count: 1 });
    }

    // Save the updated movie document
    await movie.save();

    return res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('Error recording view:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
