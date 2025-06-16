import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css'; // Custom styles for gradient, etc.

const Navbar = ({ firstName, setFirstName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // To track hover state
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login'); // Navigate to the Login page when "Sign in" is clicked
  };

  const handleLogout = () => {
    localStorage.removeItem('signupData'); // Remove data from localStorage when logging out
    setFirstName(null); // Clear the firstName state
    navigate('/login'); // Navigate to login page on logout
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to profile page (create profile page if needed)
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
              {firstName ? (
                <div 
                  className="user-info" 
                  onMouseEnter={() => setIsHovered(true)} 
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button
                    className="btn btn-light text-primary fw-semibold px-4 py-1 rounded-pill"
                    onClick={handleLogout} // Logout functionality
                  >
                    {firstName}
                  </button>
                  
                  {/* Profile button shown on hover */}
                  {isHovered && (
                    <button
                      className="btn btn-light text-primary fw-semibold px-4 py-1 rounded-pill"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-light text-primary fw-semibold px-4 py-1 rounded-pill"
                  onClick={handleSignInClick} // Navigate to login if no first name is found
                >
                  Sign in
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
