import React, { useState } from "react";
import "../styles/Signup-expert.css";
const SignupExpert = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    universityName: "",
    major: "",
    courseName: "",
    countryName: "",
    email: "",
    password: "",
    rePassword: "",
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
    setFormData((prevState) => ({ ...prevState, photo: e.target.files[0] }));
  };

  const validate = () => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.universityName)
      errors.universityName = "University name is required";
    if (!formData.major) errors.major = "Major is required";
    if (!formData.courseName) errors.courseName = "Course name is required";
    if (!formData.countryName) errors.countryName = "Country name is required";
    if (!regex.test(formData.email))
      errors.email = "Please enter a valid email";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.rePassword)
      errors.rePassword = "Passwords do not match";
    if (formData.password.length < 8)
      errors.password = "Password must be at least 8 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("signupData", JSON.stringify(formData)); // Store form data in browser memory
      setIsSubmitted(true);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {/* Photo Upload */}
        <div className="form-group photo-upload">
          <label className="photo-circle">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="User Avatar"
                className="uploaded-photo"
              />
            ) : (
              "Add Photo"
            )}
            <input type="file" name="photo" onChange={handlePhotoChange} />
          </label>
        </div>

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

        <div className="form-group">
          <label>University Name</label>
          <input
            type="text"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
          />
          {formErrors.universityName && <p>{formErrors.universityName}</p>}
        </div>

        <div className="form-group">
          <label>Major</label>
          <select name="major" value={formData.major} onChange={handleChange}>
            <option value="">Select Major</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
          {formErrors.major && <p>{formErrors.major}</p>}
        </div>

        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
          />
          {formErrors.courseName && <p>{formErrors.courseName}</p>}
        </div>

        <div className="form-group">
          <label>Country Name</label>
          <input
            type="text"
            name="countryName"
            value={formData.countryName}
            onChange={handleChange}
          />
          {formErrors.countryName && <p>{formErrors.countryName}</p>}
        </div>

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
              type={showPassword ? "text" : "password"}
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
              type={showRePassword ? "text" : "password"}
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

        <div className="form-group">
          <button type="submit">Sign Up</button>
        </div>
      </form>

      {isSubmitted && (
        <p>Signup successful! Your data is stored in the browser memory.</p>
      )}
    </div>
  );
};

export default SignupExpert;
