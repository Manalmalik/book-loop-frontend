import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { isLoggedIn, setLoggedUserId, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setLoggedUserId(null);

    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <NavLink to="/">
          <img src={logo} />
        </NavLink>
        <div className="navbar-tabs">
          <NavLink to="/" className="btn-default">
            {" "}
            My shelf{" "}
          </NavLink>
          <NavLink to="/" className="btn-default">
            {" "}
            Progress{" "}
          </NavLink>
          <NavLink to="/" className="btn-default">
            {" "}
            Reading club{" "}
          </NavLink>
        </div>
        {!isLoggedIn ? (
          <div className="buttons">
            <NavLink to="/signup" className="btn-primary">
              {" "}
              Sign Up{" "}
            </NavLink>
            <NavLink to="/login" className="btn-primary">
              {" "}
              Login{" "}
            </NavLink>
          </div>
        ) : (
          <button onClick={handleLogoutClick} className="btn-primary">
            {" "}
            Logout{" "}
          </button>
        )}
      </div>
      <hr className="hr-default" />
    </div>
  );
}

export default Navbar;
