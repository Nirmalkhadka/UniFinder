import React from "react";
import "../styles/expertProfile.css"; // Add the ExpertProfile CSS
import Arrow from "./arrow"; // Assuming you still want the Arrow component
import { useNavigate } from "react-router-dom";
const ExpertProfile1 = ({
  name,
  email,
  areaOfInterest,
  photoUrl,
}) => {
  const navigate=useNavigate();
  const Responsebutton=()=>{
    navigate('/Response-user-page')
  }
  return (
    <div className="expert-profile">
      <Arrow />
      <div className="expert-info-box">
        <div className="expert-css">
          <h2 className="profile-title">Profile</h2>

          <div className="expert-photo">
            <img src={photoUrl} alt={name} />
          </div>

          <div className="expert-details">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Area of Interest:</strong> {areaOfInterest}
            </p>
          </div>

          <div className="view-request-section">
            <button className="view-request-btn" onClick={Responsebutton}>View Response</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile1;
