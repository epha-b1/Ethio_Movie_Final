import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import Dashboard from "../../components/chart/try"; // Adjust the path as needed

export default function Home() {
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
    <div className="home">
      <FeaturedInfo />
      <Dashboard movies={movies} />

      <div className="homeWidgets">
        <WidgetLg />
      </div>
    </div>
  );
}
