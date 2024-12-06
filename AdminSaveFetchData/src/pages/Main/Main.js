import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Main.css";
import { FaTachometerAlt, FaFilm, FaSignOutAlt } from "react-icons/fa"; // Font Awesome icons

function Main() {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, [accessToken, navigate]);

  return (
    <div className="Main">
      <div className="container">
        <div className="navigation">
          <ul>
            <li>
              <a href="/main/dashboard" style={{ color: "violet" }}>
                <FaTachometerAlt /> {/* Dashboard Icon */}
              </a>
            </li>
            <li>
              <a href="/main/movies">
                <FaFilm /> {/* Movies Icon */}
              </a>
            </li>
            <li className="logout">
              <a onClick={handleLogout}>
                <FaSignOutAlt /> {/* Logout Icon */}
              </a>
            </li>
          </ul>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
