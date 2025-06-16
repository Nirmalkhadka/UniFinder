import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ setFirstName }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get stored data from localStorage
    const storedData = JSON.parse(localStorage.getItem("signupData"));
    
    // Check if email matches
    if (storedData && storedData.email === email) {
      setFirstName(storedData.firstName); // Update the first name in the Navbar component
      navigate("/"); // Navigate to a dashboard or home page
    } else {
      setError("Invalid email or no account found.");
    }
  };

  const handleBackArrow = () => {
    navigate("/"); // Navigate to HeroSection
  };

  const handleSwitchToSignUp = () => {
    navigate("/connect"); // Navigate to SignUp page
  };

  return (
    <div className="login-container">
      <button className="back-arrow" onClick={handleBackArrow} aria-label="Go back to HeroSection">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#3f47cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left" viewBox="0 0 24 24">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">
          Submit
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="signup-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="signup-link"
            onClick={handleSwitchToSignUp}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
