import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { getUsers } from "../../context/userContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import axios from "axios";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import MovieIcon from '@material-ui/icons/Movie';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LiveTvIcon from '@material-ui/icons/LiveTv';
export default function FeaturedInfo() {
  const { users, dispatch: userDispatch } = useContext(UserContext);
  const { movies, dispatch: movieDispatch } = useContext(MovieContext);
  const [isLoading, setIsLoading] = useState(true);
  const [seriesTotal, setSeriesTotal] = useState(0); // Corrected variable name

  const [TotalRevenue, setTotalRevenue] = useState();

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
        const totalSeries = res.data.length; // Corrected variable name
        setSeriesTotal(totalSeries); // Corrected variable name
      } catch (err) {
        console.log(err);
      }
    };

    fetchSeriesTotal();
  }, []);
  useEffect(() => {
    getUsers(userDispatch)
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error fetching users:", error));
  }, [userDispatch]);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        // Fetch total revenue
        const totalRevenueResponse = await axios.get("payment/total-birr", {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        });
        const totalRevenue = totalRevenueResponse.data.totalRevenue;
        setTotalRevenue(totalRevenue);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTotalRevenue();
  }, []);

  useEffect(() => {
    getMovies(movieDispatch);
  }, [movieDispatch]);

  return (
    <div className="featured">
      <div className="featuredItem Revenue">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{TotalRevenue} <span className="birr">Birr</span></span>
          <span className="featuredMoneyRate">
            <AttachMoneyIcon className="featuredIcon postive" fontSize="large" />
          </span>
        </div>
        {/* <span className="featuredSub">Compared to last month</span> */}
      </div>
      <div className="featuredItem userInfo">
        <span className="featuredTitle">Total User</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{users.length}</span>
          <span className="featuredMoneyRate">
            <SupervisorAccountIcon className="featuredIcon postive"fontSize="large" />
          </span>
        </div>
        {/* <span className="featuredSub">Compared to last month</span> */}
      </div>
      <div className="featuredItem MovieInfo">
        <span className="featuredTitle">Total Movie</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{movies.length}</span>
          <span className="featuredMoneyRate">
            <MovieIcon className="featuredIcon" fontSize="large" />
          </span>
        </div>
        {/* <span className="featuredSub">Compared to last month</span> */}
      </div>
      <div className="featuredItem SeriesInfo">
        <span className="featuredTitle">Total Series</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{seriesTotal}</span>
          <span className="featuredMoneyRate">
            <LiveTvIcon className="featuredIcon postive"fontSize="large" />
          </span>
        </div>
      </div>
    </div>
  );
}
