import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../services/index.services";
import { useAuth } from "../context/useAuth";
import { getApiError } from "../utils/getApiError";

function AuthForm() {
  const { setIsLoggedIn, setLoggedUserId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSignUpForm = location.pathname === "/signup";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
      return;
    }

    if (e.target.name === "email") {
      setEmail(e.target.value);
      return;
    }

    if (e.target.name === "password") {
      setPassword(e.target.value);
      return;
    }
  };

  const handleSignUp = async () => {
    const body = {
      name: username,
      email,
      password,
    };

    try {
      await authService.post("/auth/signup", body);
      navigate("/login");
    } catch (error) {
      const apiError = getApiError(error);

      setErrorMessage(apiError.message);
    }
  };

  const handleLogin = async () => {
    const body = {
      email,
      password,
    };

    try {
      const response = await authService.post("/auth/login", body);
      localStorage.setItem("authToken", response.data.authToken);

      //update auth states
      setIsLoggedIn(true);
      setLoggedUserId(response.data.payload._id);
      navigate("/bookShelf");
    } catch (error) {
      const apiError = getApiError(error);

      setErrorMessage(apiError.message);
    }
  };

  const handleFormSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    isSignUpForm ? handleSignUp() : handleLogin();
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleFormSubmit}>
        {isSignUpForm && (
          <div className="form-field">
            <label> Name: </label>
            <input
              required
              type="text"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="form-field">
          <label> Email: </label>
          <input
            required
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label> Password: </label>
          <input
            required
            type="text"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        {errorMessage && <div> {errorMessage} </div>}
        {isSignUpForm ? (
          <button className="btn-secondary" type="submit">
            {" "}
            Create Account{" "}
          </button>
        ) : (
          <button className="btn-secondary" type="submit">
            {" "}
            Login{" "}
          </button>
        )}
      </form>
    </div>
  );
}

export default AuthForm;
