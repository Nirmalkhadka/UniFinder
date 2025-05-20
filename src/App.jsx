import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route from React Router v6

// Import components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UserSlider from './components/User';
import About from './components/About';
import Country from './components/Country';
import Blog from './components/Blog';
import Contact from './components/contact';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Finder from './components/Finder';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home page with all sections */}
        <Route path="/" element={<PageWithNavbar Component={MainContent} />} />

        {/* Routes for the pages without Navbar (Login and SignUp) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

// Create a wrapper to conditionally render Navbar
const PageWithNavbar = ({ Component }) => {
  return (
    <>
      <Navbar /> {/* Navbar is always rendered for the main sections */}
      <Component /> {/* Renders the component passed (e.g., HeroSection, About) */}
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
      <Finder/>
    </>
  );
};

export default App;
