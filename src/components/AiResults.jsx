import React from "react";
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
                <strong>Couser Level:</strong> {course.course_level}
              </p>

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
              <p>
                <strong>University Description:</strong> {course.university_description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-courses">No courses found based on your input.</p>
      )}
    </div>
  );
};

export default AiResults;
