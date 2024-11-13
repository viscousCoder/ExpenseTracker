import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import "./Register.css"; // Assuming this is the CSS file for styling

const Register = () => {
  const firebase = useFirebase();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Additional field validations on change
    if (name === "email" && value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    // if (name === "phoneNumber") {
    //   let newValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    //   if (newValue.length <= 10) {
    //     setFormData({ ...formData, phoneNumber: newValue }); // Limit to 10 digits
    //   }
    //   // Don't show error once it's 10 digits
    //   if (newValue.length === 10) {
    //     setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
    //   } else if (newValue.length !== value.length) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       phoneNumber: "Please enter numbers only",
    //     }));
    //   }
    // }
    if (name === "phoneNumber") {
      let newValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (newValue.length <= 10) {
        setFormData({ ...formData, phoneNumber: newValue }); // Limit to 10 digits
      }
      // Don't show error once it is of the 10 digits number
      if (newValue.length === 10) {
        setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
      } else if (newValue.length !== value.length) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Please enter numbers only",
        }));
      }
    }

    if (name === "age") {
      const ageValue = parseInt(value, 10);
      if (isNaN(ageValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          age: "Please enter a valid number",
        }));
      } else if (ageValue < 18) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          age: "You are below 18",
        }));
      } else if (ageValue > 100) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          age: "You are above 100",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, age: "" }));
      }
    }

    if (name === "password") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          value.length < 6
            ? "Password must be at least 6 characters"
            : value.length > 15
            ? "Password must be no more than 15 characters"
            : "",
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle the password visibility
  };

  const handleRegister = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "age",
    ];
    let isValid = true;
    const newErrors = {};

    // Check all required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Please fill the field";
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === formData.email)) {
      newErrors.email = "User already registered with this email";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    // Register user if all validations pass
    const uniqueId = Date.now();
    const newUser = { ...formData, id: uniqueId };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    firebase
      .signupUserWithEmailAndPassword(formData.email, formData.password)
      .then((user) => {
        const userData = {
          uid: user.uid,
          ...newUser,
        };
        const allUsersData = [...firebase.users, userData];
        firebase.userDetails("users", allUsersData);
      })
      .catch((error) => {
        console.error("Signup or user details saving failed:", error);
      });

    alert("Registration successful!");
    navigate("/");
  };

  return (
    <div className="card">
      <div className="info-section">
        <h3>Hello, Friend!</h3>
        <p>Enter your personal details and start your journey with us</p>
      </div>
      <div className="form-section">
        <h2>Create Account</h2>

        {["firstName", "lastName", "email", "phoneNumber", "age"].map(
          (field) => (
            <div key={field} className="input-container">
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phoneNumber"
                    ? "text"
                    : "text"
                }
                name={field}
                placeholder={
                  field[0].toUpperCase() +
                  field.slice(1).replace("Number", " Number")
                }
                value={formData[field]}
                onChange={handleChange}
                className={errors[field] ? "error-border" : ""}
              />
              {errors[field] && (
                <p className="register-error-message">{errors[field]}</p>
              )}
            </div>
          )
        )}

        <div className="input-container">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error-border" : ""}
          />
          <i
            className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "15px",
              top: "22px",
              cursor: "pointer",
            }}
          ></i>
          {errors.password && (
            <p className="register-error-message">{errors.password}</p>
          )}
        </div>

        <button className="btn-grad" onClick={handleRegister}>
          Sign Up
        </button>

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
