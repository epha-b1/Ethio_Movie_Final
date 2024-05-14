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
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getMovies(movieDispatch);
  }, [movieDispatch]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axios.get("/serious", {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        });
        setSeries(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSeries();
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
              <td className="widgetLgStatus">{movie.views}</td>
            </tr>
          ))}
          {series.map((serie) => (
            <tr className="widgetLgTr" key={serie._id}>
              <td className="widgetLgUser">
                <img
                  src={serie.thumbnail} // Assuming `thumbnail` is the property for series thumbnail
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">{serie.title}</span>
              </td>
              <td className="widgetLgDescription">{serie.description}</td>
              <td className="widgetLgGenre">{serie.genre}</td>
              <td className="widgetLgStatus">{serie.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
