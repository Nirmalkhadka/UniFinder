import { useCallback, useState } from "react";
import "../styles/Signup-expert.css";
import "../styles/dropZone.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Arrow from "./arrow";
const SignupExpert = () => {
  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   lastName: "",
  //   universityName: "",
  //   major: "",
  //   courseName: "",
  //   countryName: "",
  //   email: "",
  //   password: "",
  //   rePassword: "",
  //   photo: null,
  // });

  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [major, setMajor] = useState("");
  const [courseName, setCourseName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [imageLink, setImageLink] = useState("");

  // const [formErrors, setFormErrors] = useState({});
  // const [isSubmitted, setIsSubmitted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const canSubmit = firstName && lastName && universityName && major && courseName && countryName && email && password && password === rePassword;

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };

  // const handlePhotoChange = (e) => {
  //   setFormData((prevState) => ({ ...prevState, photo: e.target.files[0] }));
  // };

  // const validate = () => {
  //   let errors = {};
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!formData.firstName) errors.firstName = "First name is required";
  //   if (!formData.lastName) errors.lastName = "Last name is required";
  //   if (!formData.universityName)
  //     errors.universityName = "University name is required";
  //   if (!formData.major) errors.major = "Major is required";
  //   if (!formData.courseName) errors.courseName = "Course name is required";
  //   if (!formData.countryName) errors.countryName = "Country name is required";
  //   if (!regex.test(formData.email))
  //     errors.email = "Please enter a valid email";
  //   if (!formData.password) errors.password = "Password is required";
  //   if (formData.password !== formData.rePassword)
  //     errors.rePassword = "Passwords do not match";
  //   if (formData.password.length < 8)
  //     errors.password = "Password must be at least 8 characters";

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
        universityName: universityName, 
        major: major, 
        courseName: courseName, 
        countryName: countryName, 
        email: email,
        password: password,
        profileImage: imageLink
      }

      try {
        let result = await axios({
          url: "http://localhost:8000/consultant",
          method: "POST",
          data: data
        });
        // console.log(result);
        setFirstName("");
        setLastName("");
        setUniversityName("");
        setCourseName("");
        setCountryName("");
        setMajor("Select Major");
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
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {/* Photo Upload */}
        {/* <div className="form-group photo-upload">

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







        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {/* {formErrors.firstName && <p>{formErrors.firstName}</p>} */}

        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {/* {formErrors.lastName && <p>{formErrors.lastName}</p>} */}

        </div>

        <div className="form-group">
          <label>University Name</label>
          <input
            type="text"
            name="universityName"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
          />
          {/* {formErrors.universityName && <p>{formErrors.universityName}</p>} */}

        </div>

        <div className="form-group">
          <label>Major</label>
          <select name="major" value={major} onChange={(e) => setMajor(e.target.value)}>

            <option value="">Select Major</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
          {/* {formErrors.major && <p>{formErrors.major}</p>} */}

        </div>

        <div className="form-group">
          <label>Course Name</label>
          <input
            type="text"
            name="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          {/* {formErrors.courseName && <p>{formErrors.courseName}</p>} */}

        </div>

        <div className="form-group">
          <label>Country Name</label>
          <input
            type="text"
            name="countryName"

            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
          />
          {/* {formErrors.countryName && <p>{formErrors.countryName}</p>} */}

        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"

            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* {formErrors.email && <p>{formErrors.email}</p>} */}

        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"

              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </button>
          </div>

          {/* {formErrors.password && <p>{formErrors.password}</p>} */}

        </div>

        {/* Re-password */}
        <div className="form-group">
          <label>Re-password</label>
          <div className="password-field">
            <input
              type={showRePassword ? "text" : "password"}
              name="rePassword"

              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}

            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowRePassword(!showRePassword)}
            >
              👁️
            </button>
          </div>

          {/* {formErrors.rePassword && <p>{formErrors.rePassword}</p>} */}
        </div>

        <div className="form-group">
          <button type="submit" disabled={!canSubmit}>Sign Up</button>
        </div>
      </form>

      {/* {isSubmitted && (
        <p>Signup successful! Your data is stored in the browser memory.</p>
      )} */}

    </div>
  );
};

export default SignupExpert;
