import React from 'react';
import { useLocation } from 'react-router-dom'; // To get passed data
import '../styles/expert-profile.css'; // Add the CSS file

const SendUserProfile = () => {
  const location = useLocation();
  const { expertData, userRequests } = location.state || { expertData: null, userRequests: [] };

  // Dummy data as fallback in case there is no location data
  const dummyData = [
    {
      name: "Michael Smith",
      photo: "../assets/images/1.jpg",
      email: "michael@example.com",
      areaOfInterest: "Artificial Intelligence",
      date: "2025-06-30",
      time: "14:30"
    }
  ];

  const userList = userRequests.length > 0 ? userRequests : dummyData;

  return (
    <div className="expert-profile-container">
      <h2 className="title">Users Who went to Connect</h2>
      <div className="user-requests">
        {userList.map((user, index) => (
          <div key={index} className="user-card">
            <div className="user-info">
              <img src={user.photo} alt={user.name} className="user-photo" />
              <div className="user-details">
                <h3 className="user-name">{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Area of Interest:</strong> {user.areaOfInterest}</p>
                <p><strong>Date:</strong> {user.date}</p>
                <p><strong>Time:</strong> {user.time}</p>
              </div>
            </div>
            <div className="action-buttons">
              <button className="confirm-btn">Confirm Connect</button>
              <button className="reject-btn">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SendUserProfile;
