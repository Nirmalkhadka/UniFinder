import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import UserSlider from "./components/User";
import About from "./components/About";
import Country from "./components/Country";
import Blog from "./components/Blog";
import Contact from "./components/contact";
import Login from "./components/Login";
import SignUp from "./components/Signup-expert";
import Finder from "./components/Finder";
import Country1 from "./components/CountryAi";
import Connect from "./components/Connect";
import Expert from "./components/Expert";
import Queensland from "./components/queensland";
import Sydney from "./components/sydeny";
import ExpertProfile from "./components/Expert-Profile";
import Subjects from "./components/Subject-ai";
import AiResults from "./components/AiResults";
import SignupUser from "./components/SignUp-User";
import Footer from "./components/Footer";

function App() {
  const [firstName, setFirstName] = useState(null);

  // Load first name from localStorage when the app loads
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("signupData"));
    if (storedData && storedData.firstName) {
      setFirstName(storedData.firstName); // Set first name if it's available
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for the Home page with all sections, Navbar will be shown */}
        <Route
          path="/"
          element={<PageWithNavbar Component={MainContent} firstName={firstName} setFirstName={setFirstName} />}
        />

        {/* Routes for the pages without Navbar (Login and SignUp) */}
        <Route path="/login" element={<Login setFirstName={setFirstName} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/finder" element={<Finder />} />
        <Route path="/country" element={<Country1 />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/expert" element={<Expert />} />
        <Route
          path="/queenslanduniversityoftechnology"
          element={<Queensland />}
        />
        <Route path="/westernsydneyuniversity" element={<Sydney />} />
        <Route path="/expert-profile" element={<ExpertProfile />} />
        <Route path="/subject" element={<Subjects />} />
        <Route path="/ai-results" element={<AiResults />} />
        <Route path="/signup-user" element={<SignupUser />} />
      </Routes>
    </Router>
  );
}

// Create a wrapper to conditionally render Navbar based on the route
const PageWithNavbar = ({ Component, firstName, setFirstName }) => {
  return (
    <>
      {/* Conditionally render Navbar only on pages where it's required */}
      {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && (
        <Navbar firstName={firstName} setFirstName={setFirstName} />
      )}
      {/* Render the main content */}
      <Component firstName={firstName} setFirstName={setFirstName} />
    </>
  );
};

// MainContent will be the single-page layout containing all sections
const MainContent = () => {
  return (
    <>
      <HeroSection />
      <Country />
      <UserSlider />
      <About />
      <Blog />
      <Contact />
      <Footer/>
      {/* <ExpertProfile /> */}
    </>
  );
};

export default App;
