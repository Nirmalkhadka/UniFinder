import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../styles/Login.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function Login({ setFirstName }) {
  const navigate = useNavigate(); // Hook for navigation

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(`Logging in with Email: ${email} and Password: ${password}`);

    let data = {
      email: email,
      password: password,
    };

    try {
      let result = await axios({
        url: "http://localhost:8000/student/login",
        method: "POST",
        data: data
      });

      // console.log(result);
      let token = result.data.token;
      let firstName = result.data.info.firstName;
      console.log(firstName);
      // console.log(token); 
      // console.log("ID : ", result.data.info.id);

      localStorage.setItem("token", token);
      localStorage.setItem("f_Name", firstName);
      // localStorage.setItem("id", result.data.info.id);

      setFirstName(firstName);

      navigate("/");

    } catch (error) {
      // toast.error(error.response.data.message);
      try {
        let result = await axios({
          url: "http://localhost:8000/consultant/login",
          method: "POST",
          data: data
        });

        console.log(result);
        let token = result.data.token;
        let firstName = result.data.info.firstName;
        // console.log(firstName);
        // console.log(token); 
        // console.log("ID : ", result.data.info.id);

        localStorage.setItem("token", token);
        localStorage.setItem("f_Name", firstName);

        // localStorage.setItem("id", result.data.info.id);
        setFirstName(firstName);

        navigate("/");

      } catch (error) {
        toast.error(error.response.data.message);
      }
    }

  }



  const handleBackArrow = () => {
    navigate("/"); // Navigate to HeroSection
  };

  const handleSwitchToSignUp = () => {
    navigate("/connect"); // Navigate to SignUp page
  };

  return (
    <div className="login-container">
      <ToastContainer></ToastContainer>
      {/* Back arrow */}
      <button className="back-arrow" onClick={handleBackArrow} aria-label="Go back to HeroSection">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="#3f47cc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-arrow-left"
          viewBox="0 0 24 24"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

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
          placeholder="Enter Your Registered Email"

          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter Your Registered Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />


        <button type="submit" className="submit-btn">
          Submit
        </button>


        {/* {error && <p className="error-text">{error}</p>} */}

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
