import React from 'react';
import { useLocation } from 'react-router-dom'; // To get passed data

const ExpertProfile = () => {
  const location = useLocation();
  const { expertData, userRequests } = location.state || { expertData: null, userRequests: [] };

  return (
    <div>


      <h2>Users Who Connected</h2>
      <div className="user-requests">
        {userRequests.map((user, index) => (
          <div key={index} className="user-card">
            <div className="user-info">
              <img src={user.photo} alt={user.name} className="user-photo" />
              <div className="user-details">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Area of Interest:</strong> {user.areaOfInterest}</p>
              </div>
            </div>
            <button className="confirm-btn">Confirm Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertProfile;
