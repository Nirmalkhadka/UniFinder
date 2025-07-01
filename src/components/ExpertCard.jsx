import React from "react";
import "../styles/ExpetCard.css";
import Arrow from "./arrow";
const ExpertCard = ({
  profile,
  name,
  university,
  major,
  course,
  country,
  photoUrl,
}) => {
  return (
    <div className="expert-card">
        <Arrow/>
        <h1>Connect to Our University Experts</h1>
      <div className="expert-info-box">
        <div className="expert-css">
          <h2>{profile}</h2>

          <div className="expert-photo">
            <img src={photoUrl} alt={name} />
          </div>
          <div className="expert-details">
            <p>
              <strong>University:</strong> {university}
            </p>
            <p>
              <strong>Major:</strong> {major}
            </p>
            <p>
              <strong>Course:</strong> {course}
            </p>
            <p>
              <strong>Country:</strong> {country}
            </p>
           
          </div>
           <div className="connect-section">
              <button className="connect-btn">Connect</button>
              <div className="date-time-section">
                <input type="date" />
                <input type="time" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard;
