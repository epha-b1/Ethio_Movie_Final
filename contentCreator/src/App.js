import Sidebar from "./components/sidebar/Sidebar.jsx";
import Topbar from "./components/topbar/Topbar.jsx";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserList from "./pages/userList/UserList.jsx";
import User from "./pages/user/User.jsx";
import NewUser from "./pages/newUser/NewUser.jsx";
import Login from "./pages/login/Login.jsx";
import MovieList from "./pages/movieList/MovieList.jsx";
import { AuthContext } from "./context/authContext/AuthContext.js";
import ListList from "./pages/listList/ListList.jsx";
import List from "./pages/list/List.jsx";
import NewList from "./pages/newList/NewList.jsx";
import Movie from "./pages/movie/Movie.jsx";
import NewMovie from "./pages/newMovie/NewMovie.jsx";
import NewSerious from "./pages/newSerious/NewSerious.jsx";
import { useContext } from "react";
import SeriesList from "./pages/seriesList/SeriousList.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        {user && (
          <>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/users">
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/newUser">
                <NewUser />
              </Route>
              <Route path="/movies">
                <MovieList />
              </Route>
              <Route path="/series">
                <SeriesList />
              </Route>
              <Route path="/movie/:movieId">
                <Movie />
              </Route>
              <Route path="/newMovie">
                <NewMovie />
              </Route>
              <Route path="/lists">
                <ListList />
              </Route>
              <Route path="/list/:listId">
                <List />
              </Route>
              <Route path="/newlist">
                <NewList />
              </Route>
              <Route path="/newSerious">
                <NewSerious />
              </Route>
            </div>
          </>
        )}
        {!user && <Redirect to="/login" />}
      </Switch>
    </Router>
  );
}

export default App;
