<<<<<<< HEAD
import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    // Debug: Log env variables (remove in production)
console.log("ENV CHECK:", {
  service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  user_id: import.meta.env.VITE_EMAILJS_USER_ID,
});


emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    name: formData.name,
    email: formData.email,
    message: formData.message,
  },
  import.meta.env.VITE_EMAILJS_USER_ID
)
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          setStatus("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Email send error:", error);
          setStatus("Error sending message. Please try again.");
        }
      );
  };

  return (
    <section className="contact-section1">
      <div className="div-contact">
        <h2 className="contact-title">Let's Talk</h2>
      </div>

      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-info">
            <h3>UNIFINDER</h3>
            <p>Email: info@unifinder.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: Balkumari-1, Lalitpur, Nepal</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="name-fields">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="5"
              required
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            <button type="submit">Submit</button>
          </form>

          {status && <p className="status-message">{status}</p>}
        </div>
      </section>
=======
import React from "react";
import "../styles/Contact.css";
import facebookIcon from "../assets/images/facebook.jpg";
import instagramIcon from "../assets/images/instagram.jpg";
import whatsappIcon from "../assets/images/wattshap.jpg";
import linkedinIcon from "../assets/images/linkedin.jpg";

function Contact() {
  return (
    <section className="contact-section1">
            <div className="div-contact">
            <h2 className="contact-title">Let's Talk</h2>
            </div>
    <section className="contact-section">    
      <div className="contact-content">
        {/* Left side company info */}
        <div className="contact-info">
          <h3>UNIFINDER</h3>
          <p>Email: info@unifinder.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 University Ave, Lalitpur, Nepal</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Right side form */}
        <form className="contact-form">
          <div className="name-fields">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
          </div>
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Phone Number" required />
          <textarea placeholder="Message" rows="5" required></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
    
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
    </section>
  );
}

export default Contact;
