<<<<<<< HEAD
import { useState } from 'react';
import "../styles/SignUp-user.css";
import "../styles/dropZone.css";
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Arrow from './arrow';

const SignupUser = () => {

  // const [formData, setFormData] = useState({
  //   firstName: '',
  //   lastName: '',
  //   areaOfInterest: '',
  //   email: '',
  //   password: '',
  //   rePassword: '',
  //   photo: null,
  // });

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [imageLink, setImageLink] = useState("");


  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const canSubmit = firstName && lastName && areaOfInterest && email && password && password === rePassword;


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };

  // const handlePhotoChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData((prevState) => ({ ...prevState, photo: URL.createObjectURL(file) }));
  // };

  // const validate = () => {
  //   let errors = {};
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!formData.firstName) errors.firstName = 'First name is required';
  //   if (!formData.lastName) errors.lastName = 'Last name is required';
  //   if (!formData.areaOfInterest) errors.areaOfInterest = 'Area of interest is required';
  //   if (!regex.test(formData.email)) errors.email = 'Please enter a valid email';
  //   if (!formData.password) errors.password = 'Password is required';
  //   if (formData.password !== formData.rePassword) errors.rePassword = 'Passwords do not match';
  //   if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      // localStorage.setItem('signupData', JSON.stringify(formData)); // Store form data in localStorage
      // setIsSubmitted(true);
      // console.log("Submitted !!!!");

      let data = {
        firstName: firstName,
        lastName: lastName,
        areaOfInterest: areaOfInterest,
        email: email,
        password: password,
        profileImage: imageLink
      }

      try {
        let result = await axios({
          url: "http://localhost:8000/student",
          method: "POST",
          data: data
        });
        // console.log(result);
        setFirstName(""); 
        setLastName("");
        setAreaOfInterest("");
        setEmail("");
        setPassword("");
        setRePassword("");
        setImageLink("");
        
        toast.success("Verification link sent to the registered email !");


      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  //----------------code for drop-zone image handling-----------------
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files
    let formData = new FormData();
    formData.append("image", acceptedFiles[0]);

    //hitting the backend API for uploading the single profile picture
    let result = await axios({
      url: "http://localhost:8000/file/single",
      method: "POST",
      data: formData
    });

    toast.success("Image Uploaded Successfully !!");

    // console.log(result);
    setImageLink(result.data.result);

  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="signup-container">
      <Arrow/>
      <ToastContainer></ToastContainer>
      <h2>Create Your Account</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        {/* Photo Upload */}
        {/* <div className="form-group photo-upload">
=======
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
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
          <label className="photo-circle">
            {formData.photo ? (
              <img src={formData.photo} alt="User Avatar" className="uploaded-photo" />
            ) : (
              'Add Photo'
            )}
            <input type="file" name="photo" onChange={handlePhotoChange} />
          </label>
<<<<<<< HEAD
        </div> */}

        {/* <div className="dropZone-div" {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop your image here, or click to select image</p>
          }
          {
            imageLink ?
              <img alt="profile-image" src={imageLink}></img>:null
          }
        </div> */}

        <div className="dropZone-div" {...getRootProps()}>
          <input {...getInputProps()} />
          {
            imageLink ? (
              <img className="uploaded-image" alt="profile" src={imageLink} />
            ) : (
              isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop your image here, or click to select image</p>
            )
          }
        </div>









=======
        </div>

>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        {/* First and Last Name */}
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
<<<<<<< HEAD
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {/* {formErrors.firstName && <p>{formErrors.firstName}</p>} */}
=======
            value={formData.firstName}
            onChange={handleChange}
          />
          {formErrors.firstName && <p>{formErrors.firstName}</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
<<<<<<< HEAD
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {/* {formErrors.lastName && <p>{formErrors.lastName}</p>} */}
=======
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.lastName && <p>{formErrors.lastName}</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        </div>

        {/* Area of Interest */}
        <div className="form-group">
          <label>Area of Interest</label>
          <input
            type="text"
            name="areaOfInterest"
<<<<<<< HEAD
            value={areaOfInterest}
            onChange={(e) => setAreaOfInterest(e.target.value)}
            required
          />
          {/* {formErrors.areaOfInterest && <p>{formErrors.areaOfInterest}</p>} */}
=======
            value={formData.areaOfInterest}
            onChange={handleChange}
          />
          {formErrors.areaOfInterest && <p>{formErrors.areaOfInterest}</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
<<<<<<< HEAD
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* {formErrors.email && <p>{formErrors.email}</p>} */}
=======
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <p>{formErrors.email}</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
<<<<<<< HEAD
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
=======
              value={formData.password}
              onChange={handleChange}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>
<<<<<<< HEAD
          {/* {formErrors.password && <p>{formErrors.password}</p>} */}
=======
          {formErrors.password && <p>{formErrors.password}</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
        </div>

        {/* Re-password */}
        <div className="form-group">
          <label>Re-password</label>
          <div className="password-field">
            <input
              type={showRePassword ? 'text' : 'password'}
              name="rePassword"
<<<<<<< HEAD
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
=======
              value={formData.rePassword}
              onChange={handleChange}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              👁️
            </button>
          </div>
<<<<<<< HEAD
          {/* {formErrors.rePassword && <p>{formErrors.rePassword}</p>} */}
        </div>



        {/* Submit Button */}
        <div className="form-group">
          <button className='user-button' type="submit" disabled={!canSubmit}>Submit</button>
        </div>

        {/* {isSubmitted && <p className='user-p'>Signup successful! Your data is stored in the browser.</p>} */}
=======
          {formErrors.rePassword && <p>{formErrors.rePassword}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button className='user-button' type="submit">Submit</button>
        </div>

        {isSubmitted && <p className='user-p'>Signup successful! Your data is stored in the browser.</p>}
>>>>>>> 879ac6187cd07a49d283478c23b41d2c8932658b
      </form>
    </div>
  );
};

export default SignupUser;
