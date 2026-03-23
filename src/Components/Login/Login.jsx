import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../api";
import "./login.css";
import image5 from "../../assets/image 4.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${baseUrl}/user/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("name", user.fullName);
        localStorage.setItem("userId", user._id);

        alert("Login successful");
        navigate("/home");
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-heading">
        <img src={image5} alt="Icon" />
        <h3>Musicart</h3>
      </div>

      <div className="wrapper">
        <h1>Sign in</h1>

        <div className="form-group">
          <label htmlFor="email">Enter your email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleSignin} disabled={loading}>
          {loading ? "Loading..." : "Continue"}
        </button>

        <div className="form-group">
          <p>
            By continuing, you agree to Musicart privacy notice and conditions
            of use.
          </p>
        </div>
      </div>

      <div className="login-lower-box">
        <div className="para">
          <hr />
          <p>New to Musicart?</p>
          <hr />
        </div>
        <Link to="/signup">Create your Musicart account</Link>
      </div>
    </div>
  );
};

export default Login;