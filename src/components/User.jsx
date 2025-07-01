import React, { useState, useEffect, useRef } from 'react';
import '../styles/User.css';
import user1 from '../assets/images/download.jpg';
import user2 from '../assets/images/1.jpg';
import user3 from '../assets/images/OIP.jpg';
import user4 from '../assets/images/th.jpg';

const users = [
  { name: 'Rani Shrestha', image: user1, bio: 'UNIFINDER made my university search process so much easier! I could quickly filter universities based on my academic qualifications and budget. The virtual meetings with current students were a great addition – it really helped me understand what to expect.' },
  { name: 'Anjali KC', image: user2, bio: 'As a Nepalese student trying to study abroad, I was overwhelmed by the number of options. UNIFINDER helped me narrow down my choices based on eligibility and fees. The personalized recommendations were spot-on, and the community connection feature was really helpful!' },
  { name: 'Suman Rai', image: user3, bio: '"I love how easy it is to navigate through the UNIFINDER platform. The detailed information about tuition, accommodation, and country requirements saved me hours of research. I highly recommend it to anyone planning to study abroad."' },
  { name: 'Pooja Thapa', image: user4, bio: 'UNIFINDER is a game-changer! It gave me a clear list of universities that fit my academic and financial profile. I also got to connect with fellow Nepalese students already studying abroad, which made the whole decision-making process much more comfortable.' }
];

function UserSlider() {
  const [modalUser, setModalUser] = useState(null);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    if (intervalRef.current) return; // prevent multiple intervals
    intervalRef.current = setInterval(() => {
      if (sliderRef.current) {
        const firstChild = sliderRef.current.children[0];
        sliderRef.current.appendChild(firstChild.cloneNode(true));
        sliderRef.current.removeChild(firstChild);
      }
    }, 3000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const openModal = (user) => setModalUser(user);
  const closeModal = () => setModalUser(null);

  return (
    <section className="user-slider-section">
      <h2 className="slider-title">Users</h2>
      <div className="slider-wrapper">
        <div className="slider d-flex justify-content-center gap-4" ref={sliderRef}>
          {users.map((user, index) => (
            <div
              className="card"
              key={index}
              onMouseEnter={stopAutoSlide}
              onMouseLeave={startAutoSlide}
            >
              <img src={user.image} alt={user.name} />
              <h3>{user.name}</h3>
              <p>{user.bio.substring(0, 40)}...</p>
              <button className="read-more" onClick={() => openModal(user)}>
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalUser && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>{modalUser.name}</h3>
            <p>{modalUser.bio}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default UserSlider;
