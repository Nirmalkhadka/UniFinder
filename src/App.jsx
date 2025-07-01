<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
=======
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
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
<<<<<<< HEAD
import SendUserProfile from "./components/send-user-Profile";
=======
import ExpertProfile from "./components/Expert-Profile";
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
import Subjects from "./components/Subject-ai";
import AiResults from "./components/AiResults";
import SignupUser from "./components/SignUp-User";
import Footer from "./components/Footer";
<<<<<<< HEAD
import VerifyEmail from "./components/VerifyEmail";
import VerifyEmail2 from "./components/VerifyEmail2";
import UserProfile1 from "./components/userProfile";
import ExpertProfile12 from "./components/Expert-Profile";
import ExpertProfile1 from "./components/user1Profile-card";
import ResponseUser from "./components/Response-user-page";
function App() {
  const [firstName, setFirstName] = useState(null);
  const blogRef = useRef(null); // Define the blogRef here to use it for scrolling
=======

function App() {
  const [firstName, setFirstName] = useState(null);
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b

  // Load first name from localStorage when the app loads
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("signupData"));
    if (storedData && storedData.firstName) {
      setFirstName(storedData.firstName); // Set first name if it's available
    }
  }, []);

<<<<<<< HEAD
  // Scroll to the Blog section when clicked
  const scrollToBlog = () => {
    blogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

=======
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
  return (
    <Router>
      <Routes>
        {/* Route for the Home page with all sections, Navbar will be shown */}
        <Route
          path="/"
<<<<<<< HEAD
          element={
            <PageWithNavbar
              Component={MainContent}
              firstName={firstName}
              setFirstName={setFirstName}
              scrollToBlog={scrollToBlog} // Pass the scrollToBlog function
            />
          }
=======
          element={<PageWithNavbar Component={MainContent} firstName={firstName} setFirstName={setFirstName} />}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
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
<<<<<<< HEAD
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* <Route path="/expert-profile" element={<ExpertProfile />} /> */}
        <Route path="/subject" element={<Subjects />} />
        <Route path="/ai-results" element={<AiResults />} />
        <Route path="/signup-user" element={<SignupUser />} />
        <Route path="/send-user-profile" element={<SendUserProfile />}/>
        <Route path="/Response-user-page" element={<ResponseUser/>}/>
          {/* Mine inserted route */}
        <Route
          path="/verify-email"
          element={<VerifyEmail></VerifyEmail>}
        ></Route>
        <Route
          path="/verify-email-2"
          element={<VerifyEmail2></VerifyEmail2>}
        ></Route>
=======
        <Route path="/expert-profile" element={<ExpertProfile />} />
        <Route path="/subject" element={<Subjects />} />
        <Route path="/ai-results" element={<AiResults />} />
        <Route path="/signup-user" element={<SignupUser />} />
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
      </Routes>
    </Router>
  );
}

// Create a wrapper to conditionally render Navbar based on the route
<<<<<<< HEAD
const PageWithNavbar = ({
  Component,
  firstName,
  setFirstName,
  scrollToBlog,
}) => {
  return (
    <>
      {/* Conditionally render Navbar only on pages where it's required */}
      {window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" && (
          <Navbar
            firstName={firstName}
            setFirstName={setFirstName}
            scrollToBlog={scrollToBlog} // Pass scrollToBlog to Navbar
          />
        )}
=======
const PageWithNavbar = ({ Component, firstName, setFirstName }) => {
  return (
    <>
      {/* Conditionally render Navbar only on pages where it's required */}
      {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && (
        <Navbar firstName={firstName} setFirstName={setFirstName} />
      )}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
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
<<<<<<< HEAD
      <div id="about">
        <About />
      </div>

      <div id="blog">

        {/* Assign the id "blog" to this section */}
        <Blog />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
      {/* <SendUserProfile /> */}
      <UserProfile1 />
      <ExpertProfile12 />
      {/* <ExpertProfile1/> */}
=======
      <About />
      <Blog />
      <Contact />
      <Footer/>
      {/* <ExpertProfile /> */}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
    </>
  );
};

export default App;
