import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import Login from "./pages/login/Login.jsx";
import MovieList from "./pages/movieList/MovieList.jsx";
import { AuthContext } from "./context/authContext/AuthContext";
import ListList from "./pages/listList/ListList";
import List from "./pages/list/List.jsx";
import NewList from "./pages/newList/NewList";
import Movie from "./pages/movie/Movie.jsx";
import NewMovie from "./pages/newMovie/NewMovie";
// import NewSerious from "./pages/newSerious/NewSerious";
import { useContext } from "react";

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
              {/* <Route path="/newSerious">
                <NewSerious />
              </Route> */}
            </div>
          </>
        )}
        {!user && <Redirect to="/login" />}
      </Switch>
    </Router>
  );
}

export default App;
