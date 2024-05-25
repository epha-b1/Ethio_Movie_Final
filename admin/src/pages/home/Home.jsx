import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Dashboard from "../../components/chart/try"; // Adjust the path as needed

export default function Home() {
  const MONTHS = useMemo(
    () => [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    []
  );

  const [userStats, setUserStats] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getUserStats = async () => {
      try {
        const res = await axios.get("/users/stats", {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        });
        const statsList = res.data.sort((a, b) => a._id - b._id);
        const formattedStats = statsList.map((item) => ({
          name: MONTHS[item._id - 1],
          "New User": item.total,
        }));
        setUserStats(formattedStats);
      } catch (err) {
        console.log(err);
      }
    };
    getUserStats();
  }, [MONTHS]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const res = await axios.get("/movies/allMovie");
        setMovies(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovies();
  }, []);

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userStats} title="User Analytics" grid dataKey="New User" />
      <Dashboard movies={movies} />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}
