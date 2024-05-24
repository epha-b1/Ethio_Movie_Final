import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext/AuthContext";
import logo from "../../asset/image/logo.png";
import { useHistory } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Search } from "@material-ui/icons"; // Ensure to import only the required icon

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    toast.success("Logout successful!");
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  useEffect(() => {
    const searchMovies = async () => {
      try {
        const response = await fetch(`/movies/search?q=${searchQuery}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data); // Assuming the response directly returns an array of movie objects
        } else {
          console.error("Failed to fetch search results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    searchMovies();
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img src={logo} alt="" />
          <Link to="/" className="link">
            <span>Homepage</span>
          </Link>
          <Link to="/series" className="link">
            <span className="navbarmainLinks">Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span className="navbarmainLinks">Movies</span>
          </Link>

          <Search className="icon" onClick={toggleSearch} />

          {isSearchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="searchInput"
              value={searchQuery}
              onChange={handleInputChange}
            />
          )}

          <div className="profile">
            <span className="profile_image icon">{user.username}</span>

            <div className="options">
              <Link to="/setting" className="link">
                <span>Account and Settings</span>
              </Link>
              <span onClick={handleLogout}>Logout</span>
            </div>
          </div>
        </div>
      </div>
      {/* Display search results */}
      {isSearchOpen && (
        <div className="searchResults">
          <h3>Search Results</h3>
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
