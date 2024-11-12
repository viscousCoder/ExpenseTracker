import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  let usersDB = firebase.users || [];

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === formData.email)) {
      alert("Email already exists");
      return;
    }
    const uniqueId = Date.now();
    const newUser = { ...formData, id: uniqueId };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    firebase
      .signupUserWithEmailAndPassword(formData.email, formData.password)
      .then((user) => {
        // Prepare user data for storage
        const userData = {
          uid: user.uid,
          ...newUser,
        };
        let allUsersData = [...usersDB, userData];
        console.log("hiiiii", allUsersData);
        return firebase.userDetails("users", allUsersData);
      })
      .catch((error) => {
        console.error("Signup or user details saving failed:", error);
      });
    // firebase.userDetails("users", JSON.stringify(users))
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
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
        />
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
