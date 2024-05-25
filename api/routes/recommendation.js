const express = require('express');
const mongoose = require('mongoose');
const { Movie, Rating } = require('../models/movieModel');
const router = express.Router();

// Utility function to calculate cosine similarity
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

// Get popular movies as a fallback
async function getPopularMovies(limit = 10) {
  return await Movie.find().sort({ rating: -1, vote_count: -1 }).limit(limit);
}

// Collaborative filtering recommendation route
router.get('/recommendations/:userId?', async (req, res) => {
  const { userId } = req.params;

  try {
    let userRatingMatrix = {};
    if (userId) {
      // Fetch all ratings for the specified user
      const userRatings = await Rating.find({ user: userId }).populate('movie');
      // Construct user-rating matrix
      userRatings.forEach(rating => {
        if (rating.movie) {
          userRatingMatrix[rating.movie._id] = rating.rating;
        }
      });
    }

    // Fetch all ratings
    const allRatings = await Rating.find().populate('movie');

    // If no user ID provided or user hasn't rated any movies, return popular movies
    if (!userId || Object.keys(userRatingMatrix).length === 0) {
      const popularMovies = await getPopularMovies();
      return res.json(popularMovies);
    }

    // Calculate similarity between users
    const userSimilarities = {};
    const userRatingsMap = {};

    allRatings.forEach(rating => {
      if (!rating.movie) return;  // Ensure rating.movie is not null

      if (!userRatingsMap[rating.user]) {
        userRatingsMap[rating.user] = {};
      }
      userRatingsMap[rating.user][rating.movie._id] = rating.rating;
    });

    Object.keys(userRatingsMap).forEach(otherUserId => {
      if (otherUserId === userId) return;

      const otherUserRatings = userRatingsMap[otherUserId];
      const commonMovies = Object.keys(userRatingMatrix).filter(movieId => otherUserRatings[movieId]);

      if (commonMovies.length > 0) {
        const a = commonMovies.map(movieId => userRatingMatrix[movieId]);
        const b = commonMovies.map(movieId => otherUserRatings[movieId]);
        const similarity = cosineSimilarity(a, b);

        if (similarity > 0) {
          userSimilarities[otherUserId] = similarity;
        }
      }
    });

    // Sort and select top N similar users
    const topNSimilarUsers = Object.entries(userSimilarities)
      .sort(([, simA], [, simB]) => simB - simA)
      .slice(0, 5)
      .map(([user]) => user);

    // Calculate recommendations
    let recommendedMovies = {};
    topNSimilarUsers.forEach(user => {
      const otherUserRatings = userRatingsMap[user];
      Object.keys(otherUserRatings).forEach(movieId => {
        if (!userRatingMatrix[movieId]) {
          if (!recommendedMovies[movieId]) {
            recommendedMovies[movieId] = { totalRating: 0, count: 0 };
          }
          recommendedMovies[movieId].totalRating += otherUserRatings[movieId];
          recommendedMovies[movieId].count += 1;
        }
      });
    });

    // Calculate average rating and sort
    const sortedRecommendations = Object.entries(recommendedMovies)
      .map(([movieId, { totalRating, count }]) => ({
        movieId,
        avgRating: totalRating / count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 10);

    // Fetch movie details
    const movieDetails = await Movie.find({
      _id: { $in: sortedRecommendations.map(rec => new mongoose.Types.ObjectId(rec.movieId)) },
    });

    res.json(movieDetails);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
