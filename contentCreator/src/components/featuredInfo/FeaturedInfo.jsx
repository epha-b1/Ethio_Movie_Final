import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import axios from "axios";

export default function FeaturedInfo() {
  const { movies, dispatch: movieDispatch } = useContext(MovieContext);
  const [seriesTotal, setSeriesTotal] = useState(0); // Corrected variable name

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
    getMovies(movieDispatch);
  }, [movieDispatch]);

  return (
    <div className="featured">
      {/* <div className="featuredItem">
        <span className="featuredTitle">Total Series</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{seriesTotal}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon postive" />
          </span>
        </div>
      </div> */}
      <div className="featuredItem">
        <span className="featuredTitle">Total Movies</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{movies.length}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon postive" />
          </span>
        </div>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Total Series</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{seriesTotal}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon postive" />
          </span>
        </div>
      </div>
      {/* Add your third section here */}
    </div>
  );
}
