import React from "react";
import { Link } from "react-router-dom";
import "../styles/Finder.css"; // Custom styles for the Finder page

const Finder = () => {
  return (
    <section className="finder-section">
      {/* Title */}
      <div className="finder-header">
        <h2>Find and Study in the Best Universities in the World</h2>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by University Name"
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>

      {/* Cards */}
      <div className="finder-cards">
        {/* University Finder Card */}
        <div className="finder-card">
          <Link to="/university-finder">
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/university.png"
                alt="University Finder"
              />
            </div>
            <h3>University Finder</h3>
          </Link>
        </div>

        {/* Connect to College Expert Card */}
        <div className="finder-card">
          <Link to="/connect-college-expert">
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/online-support.png"
                alt="Connect to College Expert"
              />
            </div>
            <h3>Connect to College Expert</h3>
          </Link>
        </div>

        {/* Find Program and Cost Card */}
        <div className="finder-card">
          <Link to="/find-program">
            <div className="card-icon">
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/money.png"
                alt="Find Program and Cost"
              />
            </div>
            <h3>Find Program & Cost</h3>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Finder;
