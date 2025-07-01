<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from "react";
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
import { useLocation } from "react-router-dom";
import "../styles/Airesult.css"; // Import the styles

const AiResults = () => {
  const location = useLocation();
  const { data } = location.state || {}; // Receive the data passed from Subject-ai

  return (
    <div className="ai-results">
      <h1 className="title">AI Recommended Courses</h1>
      {data && data.length > 0 ? (
        <div className="course-container">
          {data.map((course, index) => (
            <div key={index} className="course-card">
              <h2>{course.course_title}</h2>
              <p className="course-description">{course.course_description}</p>
              <p>
                <strong>University:</strong> {course.university_name}
              </p>
              <p>
<<<<<<< HEAD
                <strong>Course Level:</strong> {course.course_level}
              </p>
=======
                <strong>Couser Level:</strong> {course.course_level}
              </p>

>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
              <p>
                <strong>GPA Requirement:</strong> {course.gpa_requirement}
              </p>
              <p>
                <strong>Tuition Fee:</strong> ${course.tuition_fee_usd}
              </p>
              <p>
                <strong>IELTS:</strong> {course.ielts}
              </p>
              <p>
                <strong>TOEFL:</strong> {course.toefl}
              </p>
              <p>
                <strong>Predicted Ranking:</strong> {course.predicted_ranking}
              </p>
<<<<<<< HEAD

              {/* Toggle Button for University Description */}
              <UniversityDescription description={course.university_description} />
=======
              <p>
                <strong>University Description:</strong> {course.university_description}
              </p>
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            </div>
          ))}
        </div>
      ) : (
        <p className="no-courses">No courses found based on your input.</p>
      )}
    </div>
  );
};

<<<<<<< HEAD
// New component for University Description toggle
const UniversityDescription = ({ description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDescription = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="description-container">
      <button className="description-btn" onClick={toggleDescription}>
        {isOpen ? "Hide University Description" : "Show University Description"}
      </button>
      {isOpen && <p className="university-description">{description}</p>}
    </div>
  );
};

=======
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
export default AiResults;
