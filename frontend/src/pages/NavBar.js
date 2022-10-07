// import LINKS from "./LINKS"
import React, { useContext, useState } from "react";

import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const NavBar = () => {
  const { user, logoutFunc } = useContext(AuthContext);
  const [burger, setBurger] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  if (!user) {
    return <></>;
  }
  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        flexGrow: "1",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="navbar-brand">
        <div
          role="button"
          className={burger ? "navbar-burger is-active" : "navbar-burger"}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => setBurger(!burger)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>

      <div className={burger ? "navbar-menu is-active": "navbar-menu"  }>
        {/* <div className="navbar-start">
          <div className="navbar-item"></div>

          <Link to="/agenda" onClick={() => setBurger(!burger)}>
            <p className="navbar-item ">Agenda</p>
          </Link>
          
        </div> */}
        <div className="navbar-end">
          <div
            className="navbar-item has-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <p className="navbar-link"><span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span></p>
            <div
              className="navbar-dropdown"
              style={{ display: showDropdown ? "block" : "none" }}
            >
              <li className="navbar-item">
                <Link
                  to={`/account/${user.lid_id}`}
                  onClick={() => setBurger(!burger)}
                >
                  Account
                </Link>
              </li>

              <li className="navbar-item">
                <Link to="/addevent" onClick={() => setBurger(!burger)}>
                  New Event
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/boekstuks" onClick={() => setBurger(!burger)}>
                  Boekstuks
                </Link>
              </li>

              <li className="navbar-item">
                <Link
                  to="/login"
                  onClick={() => {
                    logoutFunc();
                    console.log("loged out");
                  }}
                >
                  Log Out
                </Link>
              </li>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
