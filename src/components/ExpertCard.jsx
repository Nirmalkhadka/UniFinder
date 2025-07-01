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
      <div className="expert-info-box">
        <div className="expert-css">
          <h2>{profile}</h2>

          <div className="expert-photo">
            <img src={photoUrl} alt={name} />
          </div>
          <div className="expert-details">
<<<<<<< HEAD
            {/* <h3>{name}</h3> */}
=======
            <h3>{name}</h3>
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
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

<<<<<<< HEAD
=======
      {/* <div className="connect-section">
        <button className="connect-btn">Connect</button>
        <div className="date-time-section">
          <input type="date" />
          <input type="time" />
        </div>
      </div> */}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
    </div>
  );
};

export default ExpertCard;
