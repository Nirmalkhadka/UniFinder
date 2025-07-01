import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './ExpertCard';
<<<<<<< HEAD
// import userData from './dummy.json';
 // Import dummy user data
import user1 from "../assets/images/download.jpg";
import user2 from '../assets/images/1.jpg';
=======
import userData from './dummy.json'; // Import dummy user data
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b

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
<<<<<<< HEAD
      photoUrl: user1
=======
      photoUrl: "path/to/queensland-photo1.jpg"
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
    },
    {
      name: "Jane Smith",
      university: "QUEENSLAND UNIVERSITY OF TECHNOLOGY",
      major: "Information Technology",
      course: "Machine Learning",
      country: "Australia",
<<<<<<< HEAD
      photoUrl: user2
=======
      photoUrl: "path/to/queensland-photo2.jpg"
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
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

<<<<<<< HEAD

=======
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
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
    </div>
  );
};

export default Queensland;