import React from "react";
import UserProfile from "./expetProfile-card"; // adjust the path if the file lives elsewhere
import pho from "../assets/images/1.jpg";
const ExpertProfile = () => {
  /**
   * Dummy expert data. Replace or extend with real data once your API / backend is ready.
   */
  const experts = [
    {
      name: "Alice Johnson",
      university: "Stanford University",
      major: "Computer Science",
      course: "Artificial Intelligence",
      country: "United States",
      photoUrl: pho,
      email: "alice.johnson@example.com",
    }
  ];

  return (
    <div className="expert-profiles">
      {experts.map((expert, index) => (
        // Spread all properties so they align with the props expected by UserProfile
        <UserProfile key={index} {...expert} />
      ))}
    </div>
  );
};

export default ExpertProfile;
