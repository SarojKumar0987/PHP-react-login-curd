import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = () => {
  // State for email, password, error message, and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To store error messages
  const [loading, setLoading] = useState(false); // Loading state for submit button
  const [emailError, setEmailError] = useState(""); // To store email validation error
  const [passwordError, setPasswordError] = useState(""); // To store password validation error
  const navigate = useNavigate(); // To navigate to the dashboard after successful login

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");
    setEmailError("");
    setPasswordError("");
    setLoading(true); // Set loading state to true

    // Validate inputs (client-side validation)
    let valid = true;
    if (!email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Your password must be 6 long");
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return; // Stop form submission if validation fails
    }

    // Prepare data to send in the request
    const loginData = {
      email,
      password,
    };

    try {
      // Send POST request to your backend API (adjust URL as needed)
      const response = await fetch("http://localhost/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        mode: "cors", // Explicitly set the mode as 'cors'
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, store the user data in localStorage or sessionStorage
        localStorage.setItem("user_id", data.user_id); // Save user ID
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        // On failure, set the error message
        setError(data.message || "Login failed");
      }
    } catch (error) {
      // Handle network or unexpected errors
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading state to false after the request is complete
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} autoComplete="on">
          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {emailError && (
              <p className="text-danger mt-2">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="text-danger mt-2">{passwordError}</p>
            )}
          </div>

          {/* Display error message if login fails */}
          {error && <p className="text-danger text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          {/* Link to Registration Page */}
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
