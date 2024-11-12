import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleLogin = () => {
    // const users = JSON.parse(localStorage.getItem("users")) || [];
    const users = firebase.users;
    firebase
      .signinUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Prepare user data for storage
        const currentUser = users?.find((curr) => curr.email === user.email);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        alert("Successfull");
        navigate("/main");
      })
      .catch((error) => {
        alert("Invalid email or password");
        console.error("Signup or user details saving failed:", error);
      });
  };

  return (
    <div className="card">
      <div className="form-section">
        <h2>Sign in</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-grad" onClick={handleLogin}>
          Sign In
        </button>
        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
      <div className="info-section">
        <h3>Welcome Back!</h3>
        <p>To keep connected with us, please log in with your personal info</p>
      </div>
    </div>
  );
};

export default Login;
