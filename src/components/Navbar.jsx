import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css'; // Custom styles for gradient, etc.

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignInClick = () => {
    navigate('/login'); // Navigate to the Login page when "Sign in" is clicked
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark custom-gradient px-3 py-2">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-3" href="#">UNIFINDER</a>
        
        {/* Hamburger button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Blog</a>
            </li>
            <li className="nav-item">
              {/* Sign in button, triggers navigation to Login page */}
              <button
                className="btn btn-light text-primary fw-semibold px-4 py-1 rounded-pill"
                onClick={handleSignInClick} // On button click, navigate to login
              >
                Sign in
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
