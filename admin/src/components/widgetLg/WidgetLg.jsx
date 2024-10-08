import "./widgetLg.css";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import axios from "axios";

export default function WidgetLg() {
  const { movies, dispatch: movieDispatch } = useContext(MovieContext);
  const [series, setSeries] = useState([]);
  const [userMap, setUserMap] = useState({});

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

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/users/find/${userId}`
      );

      // Check if the response contains the user object and the username field
      if (response.data && response.data.user && response.data.user.username) {
        return response.data;
      } else {
        console.error("Username not found in the response:", response.data);
        return { user: { username: "Unknown" }, isSubscribed: false }; // Return a default value if username is not found
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return { user: { username: "Unknown" }, isSubscribed: false }; // Return a default value in case of an error
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userPromises = movies.map(async (movie) => {
        const userData = await fetchUserById(movie.uploadedBy);
        return {
          userId: movie.uploadedBy,
          username: userData.user.username,
          role: userData.user.username || "Unknown",
        };
      });

      const userResults = await Promise.all(userPromises);

      const userMap = {};
      userResults.forEach((user) => {
        userMap[user.userId] = user.username;
        userMap[user.userId] = user.role;
      });

      setUserMap(userMap);
    };

    fetchData();
  }, [movies]);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Upload</h3>
      <table className="widgetLgTable">
        <tbody>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Title</th>
            <th className="widgetLgTh">Genre</th>
            <th className="widgetLgTh">Views</th>
            <th className="widgetLgTh">UploadedBy</th>
          </tr>
          {movies.map((movie) => (
            <tr className="widgetLgTr" key={movie._id}>
              <td className="widgetLgUser">
                <img src={movie.thumbnail} alt="" className="widgetLgImg" />
                <span className="widgetLgName">{movie.title}</span>
              </td>
              <td className="widgetLgGenre">{movie.genre}</td>
              <td className="widgetLgStatus">
                {movie.views.reduce(
                  (totalViews, view) => totalViews + view.count,
                  0
                )}
              </td>
              <td className="widgetLgStatus">
                {userMap[movie.uploadedBy] || "Loading..."}
              </td>
            </tr>
          ))}
          {series.map((serie) => (
            <tr className="widgetLgTr" key={serie._id}>
              <td className="widgetLgUser">
                <img
                  src={serie.seasons[0].episodes[0].thumbnail}
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">{serie.title}</span>
              </td>
              <td className="widgetLgGenre">{serie.genre}</td>
              <td className="widgetLgStatus">
                {serie.views.reduce(
                  (totalViews, view) => totalViews + view.count,
                  0
                )}
              </td>
              <td className="widgetLgStatus">
                {userMap[serie.uploadedBy] || "Loading..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
