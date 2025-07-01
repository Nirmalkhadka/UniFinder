import React from 'react';
import UserProfile from './expetProfile-card'; // Import the UserProfile component
import userImage from '../assets/images/download.jpg'; // Replace with a real image path

const ExpertProfile12 = () => {
  // Dummy user data for the profile
  const dummyUserData = {
    profile: "Profile",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    university: "Harvard University",
    major: "Software Engineering",
    course: "Full Stack Development",
    country: "USA",
    photoUrl: userImage // Sample image
  };

  return (
    <div>
      <UserProfile
        profile={dummyUserData.profile}
        name={dummyUserData.name}
        email={dummyUserData.email}
        university={dummyUserData.university}
        major={dummyUserData.major}
        course={dummyUserData.course}
        country={dummyUserData.country}
        photoUrl={dummyUserData.photoUrl}
      />
    </div>
  );
};

export default ExpertProfile12;
