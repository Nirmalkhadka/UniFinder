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
    
    </section>
  );
}

export default Contact;
