import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import "./Login.css";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const firebase = useFirebase();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Please fill the field");
    } else if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("Please fill the field");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    // Check if fields are empty or email is invalid before sending the request to the firebase realtime database.
    if (!email) setEmailError("Please fill the field");
    if (!password) setPasswordError("Please fill the field");
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }
    if (!email || !password) return;

    const users = firebase.users;

    // try {
    //   const user = await firebase.signinUserWithEmailAndPassword(
    //     email,
    //     password
    //   );

    //   if (user && user.email) {
    //     const currentUser = users?.find((curr) => curr.email === user.email);

    //     if (currentUser) {
    //       localStorage.setItem("currentUser", JSON.stringify(currentUser));
    //       toast.success("Login Successfully");
    //       navigate("/main");
    //     } else {
    //       toast.error("Invalid credentailas");
    //     }
    //   }
    // } catch (error) {
    //   if (error.code === "auth/invalid-credential") {
    //     // Show only the general submit error message
    //     setSubmitError("Invalid email or password");
    //   } else {
    //     toast.error("Login failed. Please try again.");
    //   }
    // }
    firebase
      .signinUserWithEmailAndPassword(email, password)
      .then((user) => {
        // Prepare user data for storage
        console.log("error", user.email, users);
        const currentUser = users?.find((curr) => curr.email === user.email);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        toast.success("Successfully Login");
        navigate("/main");
        console.log("error2");
      })
      .catch((error) => {
        toast.error("Invalid email or password");
        console.error("Signup or user details saving failed:", error);
      });
  };

  return (
    <div className="card">
      <div className="form-section">
        <h2>Sign in</h2>

        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onFocus={() => {
              setEmailError("");
              setSubmitError("");
            }}
            className={emailError ? "error-border" : ""}
          />
          {emailError && <p className="login-error-message">{emailError}</p>}
        </div>

        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => {
              setPasswordError("");
              setSubmitError("");
            }}
            className={passwordError ? "error-border" : ""}
          />

          <i
            className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "15px",
              top: "22px",
              cursor: "pointer",
            }}
          ></i>
          {passwordError && (
            <p className="login-error-message">{passwordError}</p>
          )}
        </div>

        {/* General error message for invalid credentials */}
        {submitError && (
          <p className="login-error-message submit-error">{submitError}</p>
        )}

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
