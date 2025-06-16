import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './ExpertCard';
import userData from './dummy.json'; // Import dummy user data

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
      photoUrl: "path/to/queensland-photo1.jpg"
    },
    {
      name: "Jane Smith",
      university: "QUEENSLAND UNIVERSITY OF TECHNOLOGY",
      major: "Information Technology",
      course: "Machine Learning",
      country: "Australia",
      photoUrl: "path/to/queensland-photo2.jpg"
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
      <h1>Connect to Our University Experts</h1>
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

      <div>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={e => setSelectedDate(e.target.value)} 
        />
        <input 
          type="time" 
          value={selectedTime} 
          onChange={e => setSelectedTime(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default Queensland;