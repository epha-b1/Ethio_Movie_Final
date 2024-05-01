import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { updateMovie } from "../../context/movieContext/apiCalls";
import "./movie.css";
import { Publish } from "@material-ui/icons";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useHistory } from "react-router-dom";

// Movie component
export default function Movie() {
  // Get movie data from location
  const location = useLocation();
  const movie = location.movie;

  // Get dispatch function from MovieContext
  const { dispatch } = useContext(MovieContext);

  // State to store updated movie data
  const [updatedMovie, setUpdatedMovie] = useState({
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    limit: movie.limit,
    trailer: movie.trailer,
    video: movie.video,
  });

  // Handle input change for updating movie data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMovie({
      ...updatedMovie,
      [name]: value,
    });
  };
  const history = useHistory();

  // Handle movie update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Call updateMovie function from API calls
      await updateMovie(movie._id, updatedMovie, dispatch); // Pass dispatch as the third argument
      history.push("/movies");
    } catch (err) {
      // Handle update error
      console.error("Error updating movie:", err);
    }
  };

  // Render component JSX
  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Movie</h1>
        <Link to="/newMovie">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        {/* Movie details */}
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={movie.img} alt="" className="productInfoImg" />
            <span className="productName">{movie.title}</span>
          </div>
          <div className="productInfoBottom">
            {/* Display movie details */}
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{movie._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{movie.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">year:</span>
              <span className="productInfoValue">{movie.year}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">limit:</span>
              <span className="productInfoValue">{movie.limit}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        {/* Movie update form */}
        <form className="productForm">
          <div className="productFormLeft">
            {/* Input fields for updating movie data */}
            <label>Movie Title</label>
            <input
              type="text"
              name="title"
              value={updatedMovie.title}
              onChange={handleInputChange}
            />
            <label>Year</label>
            <input
              type="text"
              name="year"
              value={updatedMovie.year}
              onChange={handleInputChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={updatedMovie.genre}
              onChange={handleInputChange}
            />
            <label>Limit</label>
            <input
              type="text"
              name="limit"
              value={updatedMovie.limit}
              onChange={handleInputChange}
            />
            {/* File inputs for trailer and video */}
            <label>Trailer</label>
            <input type="file" name="trailer" onChange={handleInputChange} />
            <label>Video</label>
            <input type="file" name="video" onChange={handleInputChange} />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              {/* Upload image */}
              <img src={movie.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            {/* Button to trigger movie update */}
            <button className="productButton" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
