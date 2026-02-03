import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <div className="brand__mark">S</div>
          <div>
            <p className="brand__title">SensorSphere</p>
            <p className="brand__subtitle">Smart sensors for every industry</p>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            Shop Sensors
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            Admin Inventory
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
