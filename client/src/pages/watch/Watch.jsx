import React, { useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { ArrowBackOutlined } from "@material-ui/icons";
import "./watch.scss";

export default function Watch() {
  const location = useLocation();
  const movie = location.movie;

  useEffect(() => {
    const updateViews = async () => {
      try {
        await axios.post(`/movies/${movie._id}/views`, {}, {
          headers: {
            token:
            "Bearer "+JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };
    updateViews();
  }, [movie]);
  // Trigger the effect whenever the 'movie' object changes

  return (
    <div className="watch">
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>
      <video className="video" autoPlay controls controlsList="nodownload" src={movie.video} />
    </div>
  );
}
