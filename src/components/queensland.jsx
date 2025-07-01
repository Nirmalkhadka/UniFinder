import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './ExpertCard';
// import userData from './dummy.json';
 // Import dummy user data
import user1 from "../assets/images/download.jpg";
import user2 from '../assets/images/1.jpg';

const Queensland = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const queenslandExperts = [
    {
      name: "John Doe",
      university: "QUEENSLAND UNIVERSITY OF TECHNOLOGY",
      major: "Computer Science",
      course: "Advanced Web Development",
      country: "Australia",
      photoUrl: user1

    },
    {
      name: "Jane Smith",
      university: "QUEENSLAND UNIVERSITY OF TECHNOLOGY",
      major: "Information Technology",
      course: "Machine Learning",
      country: "Australia",
      photoUrl: user2

    }
  ];

  const handleConnect = (expert) => {
    // Send both expert data and user data to the ExpertProfile page
    navigate('/expert-profile', {
      state: {
        expertData: expert,
        userRequests: userData.map(user => ({
          ...user, // user data
          date: selectedDate,
          time: selectedTime
        }))
      }
    });
  };

  return (
    <div>
      {queenslandExperts.map((expert, index) => (
        <ExpertCard 
          key={index}
          profile={expert.name}
          name={expert.name}
          university={expert.university}
          major={expert.major}
          course={expert.course}
          country={expert.country}
          photoUrl={expert.photoUrl}
          onConnect={() => handleConnect(expert)} // Add connect button handler
        />
      ))}




    </div>
  );
};

export default Queensland;