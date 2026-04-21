import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Navbar.css';
function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Wylogowano!");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {user && user.role === 'admin' && (
  <Link to="/admin" className="navbar-admin-btn">
  <i className="fas fa-user-shield"></i>
  <span>Panel Admina</span>
</Link>
)}
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        Travel Explorer
      </div>

      <div className="nav-links">

        <Link to="/offers">Destinations</Link>
        <Link to="/deals">Deals</Link>
        <Link to="/testimonials">Opinie</Link>
      </div>

      <div className="nav-buttons">
        {user ? (

          <div className="user-controls">
            <span className="welcome-text">Cześć, <strong>{user.username}</strong>!</span>
            <button onClick={handleLogout} className="logout-btn">
              Wyloguj
            </button>
          </div>
        ) : (

          <>
            <button onClick={() => navigate("/login")} className="login">
              Log in
            </button>
            <button onClick={() => navigate("/signup")} className="signup">
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;