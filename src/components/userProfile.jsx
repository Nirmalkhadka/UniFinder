import React from 'react';
import ExpertProfile1 from './user1Profile-card'; // Import the ExpertProfile component
import michaelPhoto from '../assets/images/1.jpg'; // Path to dummy image (update accordingly)

const UserProfile1 = () => {
  // Dummy expert data
  const dummyData = [
    {
      name: "Michael Smith",
      photo: michaelPhoto,  // Assuming the image path is correct
      email: "michael@example.com",
      areaOfInterest: "Artificial Intelligence",
    }
  ];

  return (
    <div>
      {dummyData.map((expert, index) => (
        <ExpertProfile1
          key={index}
          name={expert.name}
          email={expert.email}
          areaOfInterest={expert.areaOfInterest}
          photoUrl={expert.photo}
        />
      ))}
    </div>
  );
};

export default UserProfile1;
