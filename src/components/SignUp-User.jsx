import React, { useState } from 'react';
import "../styles/SignUp-user.css"
const SignupUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    areaOfInterest: '',
    email: '',
    password: '',
    rePassword: '',
    photo: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, photo: URL.createObjectURL(file) }));
  };

  const validate = () => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.areaOfInterest) errors.areaOfInterest = 'Area of interest is required';
    if (!regex.test(formData.email)) errors.email = 'Please enter a valid email';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.rePassword) errors.rePassword = 'Passwords do not match';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('signupData', JSON.stringify(formData)); // Store form data in localStorage
      setIsSubmitted(true);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* Photo Upload */}
        <div className="form-group photo-upload">
          <label className="photo-circle">
            {formData.photo ? (
              <img src={formData.photo} alt="User Avatar" className="uploaded-photo" />
            ) : (
              'Add Photo'
            )}
            <input type="file" name="photo" onChange={handlePhotoChange} />
          </label>
        </div>

        {/* First and Last Name */}
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {formErrors.firstName && <p>{formErrors.firstName}</p>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.lastName && <p>{formErrors.lastName}</p>}
        </div>

        {/* Area of Interest */}
        <div className="form-group">
          <label>Area of Interest</label>
          <input
            type="text"
            name="areaOfInterest"
            value={formData.areaOfInterest}
            onChange={handleChange}
          />
          {formErrors.areaOfInterest && <p>{formErrors.areaOfInterest}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <p>{formErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>
          {formErrors.password && <p>{formErrors.password}</p>}
        </div>

        {/* Re-password */}
        <div className="form-group">
          <label>Re-password</label>
          <div className="password-field">
            <input
              type={showRePassword ? 'text' : 'password'}
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              👁️
            </button>
          </div>
          {formErrors.rePassword && <p>{formErrors.rePassword}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button className='user-button' type="submit">Submit</button>
        </div>

        {isSubmitted && <p className='user-p'>Signup successful! Your data is stored in the browser.</p>}
      </form>
    </div>
  );
};

export default SignupUser;
