import "./widgetLg.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import axios from "axios";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  const { movies, dispatch: movieDispatch } = useContext(MovieContext);

  useEffect(() => {
    getMovies(movieDispatch);
  }, [movieDispatch]);
  useEffect(() => {
    const fetchSeriesTotal = async () => {
      try {
        const res = await axios.get("/serious", {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        });
        const Series = res.data; // Corrected variable name
      } catch (err) {
        console.log(err);
      }
    };

    fetchSeriesTotal();
  }, []);
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Upload</h3>
      <table className="widgetLgTable">
        <tbody>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Title</th>
            <th className="widgetLgTh">Description</th>
            <th className="widgetLgTh">Genre</th>
            <th className="widgetLgTh">Views</th>
          </tr>
          {movies.map((movie) => (
            <tr className="widgetLgTr" key={movie._id}>
            <td className="widgetLgUser">
              <img
                src={movie.thumbnail} // Assuming `thumbnail` is the property for movie thumbnail
                alt=""
                className="widgetLgImg"
              />
              <span className="widgetLgName">{movie.title}</span>
            </td>
            <td className="widgetLgDescription">{movie.description}</td>
            <td className="widgetLgGenre">{movie.genre}</td>
            <td className="widgetLgStatus">{movie.views}
            </td>
          </tr>
          
          ))}
        </tbody>
      </table>
    </div>
  );
}
