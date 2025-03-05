// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/notes" className="navbar-item">
            <strong>Shopping Notes</strong>
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/notes" className="navbar-item">
              My Notes
            </Link>
            <Link to="/notes/create" className="navbar-item">
              Create New Note
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
