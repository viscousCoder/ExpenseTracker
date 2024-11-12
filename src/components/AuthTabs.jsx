import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-tabs">
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab("login")}
          className={activeTab === "login" ? "active" : ""}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={activeTab === "register" ? "active" : ""}
        >
          Register
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
}

export default AuthTabs;
