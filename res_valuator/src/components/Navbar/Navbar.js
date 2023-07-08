import React, { useState } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link, useNavigate} from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const user = localStorage.getItem("token");
  const navigate=useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="intelli-hire__navbar">
      <div className="intelli-hire__navbar-links">
        <div className="intelli-hire__navbar-links_logo">
          <h3 style={{ color: "white" }}>Intelli Hire </h3>
        </div>
        <div className="intelli-hire__navbar-links_container">
          <Link to="/">
            <p>
              <a href="#home">Home</a>
            </p>
          </Link>
          <p>
            <a href="#abt">What is Intelli Hire?</a>
          </p>
          <p>
            <a href="#features">Features</a>
          </p>
        </div>
      </div>
      <div className="intelli-hire__navbar-sign">
        {user != null ? (
          <>
            <button onClick={handleLogout} type="button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <p>Sign in</p>
            </Link>
            <Link to="/signup">
              <button type="button">Sign up</button>
            </Link>
          </>
        )}
      </div>
      <div className="intelli-hire__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="intelli-hire__navbar-menu_container scale-up-center">
            <div className="intelli-hire__navbar-menu_container-links">
              <Link to="/">
                <p>
                  <a href="#home">Home</a>
                </p>
              </Link>
              <p>
                <a href="#abt">What is Intelli Hire?</a>
              </p>
              <p>
                <a href="#features">Features</a>
              </p>
            </div>
            <div className="intelli-hire__navbar-menu_container-links-sign">
              {user != null ? (
                <>
                  <button onClick={handleLogout} type="button">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <p>Sign in</p>
                  </Link>
                  <Link to="/signup">
                    <button type="button">Sign up</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
