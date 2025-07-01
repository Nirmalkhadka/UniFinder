import React from "react";
import destination from "../assets/images/destinaton1.jpeg";
import "../styles/Header-Ai.css";
import headerImage from "../assets/images/right_uni.png";  
import major from "../assets/images/major2.png";
<<<<<<< HEAD
import subject from "../assets/images/subject1.png";
import score from"../assets/images/score1.png";
import acadamic from"../assets/images/acadamic.png";
import budget from"../assets/images/budget.png";

=======
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
const HeaderAi = () => {
  return (
    <div>
      {/* New Header with Text and Image */}
      <div className="intro-header">
        <div className="intro-text">
          <h1 className="h1-header">Struggling to find the right University?</h1>
          <p>
<<<<<<< HEAD
            University finder is an AI-powered tool that can guide you in choosing the perfect program and University based on your interests, high school grades, and budget.
=======
            University finder is an AI powered tool that can guide you in choosing the perfect program and University based on your interests, high school grades, and budget.
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
          </p>
        </div>
        <div className="intro-image">
          <img src={headerImage} alt="University Finder" />
        </div>
      </div>

      {/* Main Section */}
      <section className="country-section2">
        {/* Header */}
        <div className="country-header">
          <h2>Find Your Dream University</h2>
          <p>Choose your destination and discover the best universities for you.</p>
        </div>

        {/* Step Icons */}
        <div className="step-icons">
          {/* Step 1 - Destination */}
          <div className="step-item">
            <div className="step-circle">
              <img src={destination} alt="Destination" />
            </div>
            <p>Destination</p>
          </div>

          {/* Step 2 - Select Major */}
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">
              <img src={major} alt="Select Major" />
            </div>
            <p>Select Major</p>
          </div>

          {/* Step 3 - Select Subjects */}
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">
<<<<<<< HEAD
              <img src={subject} alt="Select Subjects" />
=======
              <img src="../assets/images/subjects-logo.png" alt="Select Subjects" />
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            </div>
            <p>Select Subjects</p>
          </div>

          {/* Step 4 - Enter Score */}
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">
<<<<<<< HEAD
              <img src={score} alt="Enter Score" />
=======
              <img src="../assets/images/score-logo.png" alt="Enter Score" />
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            </div>
            <p>Enter Score</p>
          </div>

          {/* Step 5 - Enter Academic */}
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">
<<<<<<< HEAD
              <img src={acadamic} alt="Enter Academic" />
=======
              <img src="../assets/images/academic-logo.png" alt="Enter Academic" />
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            </div>
            <p>Enter Academic</p>
          </div>

          {/* Step 6 - Enter Budget */}
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">
<<<<<<< HEAD
              <img src={budget} alt="Enter Budget" />
=======
              <img src="../assets/images/budget-logo.png" alt="Enter Budget" />
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            </div>
            <p>Enter Budget</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeaderAi;
