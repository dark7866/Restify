import { useContext, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { HiSearch } from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import "./style.css";

const Navbar = () => {
  const { authToken, setAuthToken } = useContext(AuthContext);
  const [userNotificatons, setUserNotificatons] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  const onLogout = () => {
    localStorage.clear();
    setAuthToken("");
  };

  function secondsToHms(d) {
    let current = new Date();
    let diff = (current - new Date(Date.parse(d))) / 1000;
    d = Number(diff);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minutes " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    var timeValue =
      hDisplay === "" ? (mDisplay === "" ? sDisplay : mDisplay) : hDisplay;
    return timeValue + " ago";
  }

  useEffect(() => {
    const getUserNotifications = async () => {
      await fetch("http://127.0.0.1:8000/account/notification/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setUserNotificatons(data["results"]);
          });
        } else {
          //
        }
      });
    };
    const getRestaurantInfo = async () => {
      await fetch("http://127.0.0.1:8000/restaurant/update/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) =>
        response.json().then((data) => {
          setRestaurantInfo(data);
        })
      );
    };

    getRestaurantInfo();
    getUserNotifications();
  }, [authToken]);

  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg">
        <div className="container">
          <Link
            style={{ color: "black", cursor: "pointer" }}
            className="navbar-brand"
            to="/"
          >
            Restify
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <form className="w-25" action="/search">
            <div className="row">
              <input
                name="search_query"
                className="searchBar col"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="faButton col-2" type="submit">
                <HiSearch className="iconFont" />
              </button>
            </div>
          </form>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <div className="dropdown">
                <Link
                    to={`/restaurant/${
                      restaurantInfo["id"] ?? "create-restaurant"
                    }`}
                    aria-current="page"
                    style={{ color: "black", cursor: "pointer" }}
                    className="nav-link active"
                  >
                    <FaStore
                      style={{ cursor: "pointer" }}
                      className="navIconStyle icon"
                    />
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <a
                    style={{ color: "black", cursor: "pointer" }}
                    className="nav-link active"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="navIconStyle icon bi bi-bell"></i>
                  </a>
                  {userNotificatons.length !== 0 && (
                    <span className="notification-badge position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                  )}
                  <ul
                    style={{ left: "-180px", width: "400px" }}
                    className="dropdown-menu p-0"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <h4 className="text-center p-2">Notifications</h4>
                    {userNotificatons.map((item, index) => (
                      <li key={index}>
                        <Link
                          className="dropdown-item border-top border-bottom"
                          to="#"
                        >
                          <div className="row g-0">
                            <div className="col p-2">
                              <img
                                src={
                                  item.user
                                    ? item.user["avatar"] ??
                                      "https://wretched.org/wp-content/uploads/2017/09/Anon-profile.png"
                                    : item.restaurant["logo"] ??
                                      "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png"
                                }
                                className="notification-image"
                                alt="avatar"
                              />
                            </div>
                            <div className="notification-margins col p-2">
                              <h5
                                className="notification-margins"
                                style={{ fontSize: "18px" }}
                              >
                                {item.type === "Follow"
                                  ? `${item.user["first_name"]} followed your restaurant`
                                  : item.type === "Liked_Restaurant"
                                  ? `${item.user["first_name"]} liked your restaurant`
                                  : item.type === "Liked_Blog"
                                  ? `${item.user["first_name"]} liked a blog post`
                                  : item.type === "Comment"
                                  ? `${item.user["first_name"]} left a comment`
                                  : item.type === "Menu"
                                  ? item.restaurant["name"] +
                                    " updated their menu"
                                  : item.restaurant["name"] +
                                    " posted a new blog"}
                              </h5>
                              <p
                                className="notification-margins"
                                style={{
                                  marginBottom: "-100px",
                                  fontSize: "12px",
                                  color: "gray",
                                }}
                              >
                                {secondsToHms(item.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <a
                    style={{ color: "black", cursor: "pointer" }}
                    className="nav-link active"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="navIconStyle icon bi bi-person-circle"></i>
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={onLogout}
                        className="dropdown-item text-danger"
                        to="/"
                      >
                        Sign Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet context={[userNotificatons, setUserNotificatons]} />
    </>
  );
};

export default Navbar;
