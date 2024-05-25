import React, { useEffect, useState, useRef } from "react";
import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from "@material-ui/icons";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Loader from '../loader/Loader.jsx'; // Import the Loader component
import "../listItem/listItem.scss";
import "./searchResults.scss"
import "../list/list.scss";
import { PlayArrow, Add, ThumbUpAltOutlined, ThumbDownOutlined } from "@material-ui/icons";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetch(`/movies/search?q=${query}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error("Failed to fetch search results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  console.log("mereph");
  console.log(searchResults);

  // Define ListItem component locally within SearchResultsPage
  const ListItem = ({ index, item }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link to={{ pathname: "/watch", movie: item }}>
        <div
          className="listItem"
          style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img src={item.thumbnail} alt="" />
          {isHovered && (
            <>
              <video src={item.trailer} autoPlay={true} loop />
              <div className="itemInfo">
                <div className="icons">
                  <PlayArrow className="icon" />
                  <Add className="icon" />
                  <ThumbUpAltOutlined className="icon" />
                  <ThumbDownOutlined className="icon" />
                </div>
                <div className="itemInfoTop">
                  <span>{item.duration}</span>
                  <span className="limit">+{item.rating}</span>
                  <span>{new Date(item.releaseDate).getFullYear()}</span>
                </div>
                <div className="desc">{item.description}</div>
                <div className="genre">{item.genre.join(", ")}</div>
              </div>
            </>
          )}
        </div>
      </Link>
    );
  };

  // Define List component locally within SearchResultsPage
  const List = ({ list }) => {
    const [isMoved, setIsMoved] = useState(false);
    const [slideNumber, setSlideNumber] = useState(0);
    const [clickLimit, setClickLimit] = useState(window.innerWidth / 230);
    const listRef = useRef();

    const handleClick = (direction) => {
      setIsMoved(true);
      let distance = listRef.current.getBoundingClientRect().x - 50;
      if (direction === "left" && slideNumber > 0) {
        setSlideNumber(slideNumber - 1);
        listRef.current.style.transform = `translateX(${230 + distance}px)`;
      }
      if (direction === "right" && slideNumber < 10 - clickLimit) {
        setSlideNumber(slideNumber + 1);
        listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      }
    };

    return (
      <div className="list">
        <span className="listTitle">{list.title}</span>
        <div className="wrapper">
          <ArrowBackIosOutlined
            className="sliderArrow left"
            onClick={() => handleClick("left")}
            style={{ display: !isMoved && "none" }}
          />
          <div className="container" ref={listRef}>
            {list.content.map((item, i) => (
              <ListItem key={i} index={i} item={item} /> // Render ListItem component here
            ))}
          </div>
          <ArrowForwardIosOutlined
            className="sliderArrow right"
            onClick={() => handleClick("right")}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Loader /> 
      </div>
    );
  }

  return (
    <div className="searched_container">
      <List list={{ title: `Search Results for: ${query}`, content: searchResults }} /> 
    </div>
  );
};

export default SearchResultsPage;
