import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { updateMovie } from "../../context/movieContext/apiCalls";
import "./movie.css";
import { Publish } from "@material-ui/icons";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useHistory } from "react-router-dom";

// Movie component
export default function Series() {
  // Get movie data from location
  const location = useLocation();
  const series = location.series;

  // Get dispatch function from MovieContext
  const { dispatch } = useContext(MovieContext);

  // State to store updated movie data
  const [updatedMovie, setUpdatedMovie] = useState({
    title: series.title,
    language: series.language,
    genre: series.genre,
    rating: series.rating,
    trailer: series.trailer,
    video: series.video,
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
      await updateMovie(series._id, updatedMovie, dispatch); // Pass dispatch as the third argument
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
            <img src={series.img} alt="" className="productInfoImg" />
            <span className="productName">{series.title}</span>
          </div>
          <div className="productInfoBottom">
            {/* Display movie details */}
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{series._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{series.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">rating:</span>
              <span className="productInfoValue">{series.rating}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">language:</span>
              <span className="productInfoValue">{series.language}</span>
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
            <label>rating</label>
            <input
              type="text"
              name="year"
              value={updatedMovie.rating}
              onChange={handleInputChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={updatedMovie.genre}
              onChange={handleInputChange}
            />
            <label>language</label>
            <input
              type="text"
              name="language"
              value={updatedMovie.language}
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
              <img src={series.img} alt="" className="productUploadImg" />
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
