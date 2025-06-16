import React, { useState, useEffect, useRef } from 'react';
import '../styles/User.css';
import user1 from '../assets/images/download.jpg';
import user2 from '../assets/images/1.jpg';
import user3 from '../assets/images/OIP.jpg';
import user4 from '../assets/images/th.jpg';

const users = [
  { name: 'David Carl', image: user1, bio: 'David is a software developer from NY.' },
  { name: 'Rose Bush', image: user2, bio: 'Rose is a data scientist from LA.' },
  { name: 'James Call', image: user3, bio: 'James is a product designer from SF.' },
  { name: 'Linda May', image: user4, bio: 'Linda is a project manager from Seattle.' }
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
