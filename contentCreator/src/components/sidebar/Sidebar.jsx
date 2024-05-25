import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  PlayCircleOutline,
  List,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
  AddToQueue,
  QueuePlayNext,
  PlayArrow,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const handleItemClick = (event) => {
    const activeItem = document.querySelector('.sidebarListItem.active');
    if (activeItem) {
      activeItem.classList.remove('active');
    }
    event.currentTarget.classList.add('active');
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link" >
              <li className="sidebarListItem active" onClick={handleItemClick}>
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>
            <li className="sidebarListItem"onClick={handleItemClick}>
              <Timeline className="sidebarIcon" />
              <Link to="/analytics" className="link">
                Analytics
              </Link>{" "}
            </li>
            {/* <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Sales
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem" onClick={handleItemClick}>
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/movies" className="link">
              <li className="sidebarListItem" onClick={handleItemClick}>
                <PlayCircleOutline className="sidebarIcon" />
                Movies
              </li>
            </Link>
            <Link to="/series" className="link">
              <li className="sidebarListItem" onClick={handleItemClick}>
                <PlayArrow className="sidebarIcon" />
                Series
              </li>
            </Link>
            
            <Link to="/newMovie" className="link">
              <li className="sidebarListItem" onClick={handleItemClick}>
                <AddToQueue className="sidebarIcon" />
                Add Movie
              </li>
            </Link>
            <Link to="/newSerious" className="link">
              <li className="sidebarListItem" onClick={handleItemClick}>
                <AddToQueue className="sidebarIcon" />
                Add Serious
              </li>
            </Link>
            
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem"  onClick={handleItemClick}>
              <MailOutline className="sidebarIcon" />
              Mail
            </li>
            <li className="sidebarListItem" onClick={handleItemClick}>
              <DynamicFeed className="sidebarIcon" />
              Feedback
            </li>
            <li className="sidebarListItem" onClick={handleItemClick}>
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem" onClick={handleItemClick}>
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
            <li className="sidebarListItem" onClick={handleItemClick}>
              <Timeline className="sidebarIcon" />
              Analytics
            </li>
            <li className="sidebarListItem" onClick={handleItemClick}>
              <Report className="sidebarIcon" />
              Reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
