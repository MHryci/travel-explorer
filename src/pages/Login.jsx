import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(`Witaj ponownie, ${data.user.username}!`);
        

        navigate("/");
        

        window.location.reload(); 
      } else {
        alert("Błąd: " + data.message);
      }
    } catch (error) {
      console.error("Błąd logowania:", error);
      alert("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Witaj z powrotem!</h2>
        <p>Zaloguj się, aby zarządzać swoimi rezerwacjami.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="Twój e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Hasło</label>
            <input 
              type="password" 
              placeholder="Twoje hasło" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Nie masz konta? </span>
          <Link to="/signup">Zarejestruj się</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;