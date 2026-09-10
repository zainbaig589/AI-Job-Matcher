import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-inner">

        <div className="logo">

          <div className="logo-icon">
            <div className="logo-document"></div>
            <div className="logo-search"></div>
          </div>

          <div className="logo-text">
            <span>Doc</span>
            <strong>Search</strong>
          </div>

        </div>


        <nav className="nav-links">

          <a href="#home" className="active">
            Home
          </a>

          <a href="#search">
            Search
          </a>

          <a href="#upload">
            Upload Data
          </a>

          <a href="#about">
            About
          </a>

        </nav>


        <div className="nav-right">

          <button className="theme-button">
            ☼
          </button>

          <button className="get-started">
            Get Started
          </button>

        </div>

      </div>

    </header>
  );
}