import React from 'react';
import ExpertCard from './ExpertCard';
import photo from '../assets/images/download.jpg';

const sydneyData = {
  profile: "Expert Profile",
  name: "Jane Smith",
  university: "WESTERN SYDNEY UNIVERSITY",
  major: "Information Technology",
  course: "Machine Learning",
  country: "Australia",
  photoUrl: photo
};

const Sydney = () => {
  return (
    <div>
      <ExpertCard 
        profile={sydneyData.profile}
        name={sydneyData.name}
        university={sydneyData.university}
        major={sydneyData.major}
        course={sydneyData.course}
        country={sydneyData.country}
        photoUrl={sydneyData.photoUrl}
      />
    </div>
  );
};

export default Sydney;
