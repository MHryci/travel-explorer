import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name, 
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(`Witaj na pokładzie, ${name}! Twoje konto zostało utworzone. Zaloguj się.`);
      navigate("/login");
    } else {
      alert("Błąd rejestracji: " + data.message);
    }
  } catch (error) {
    console.error("Błąd połączenia z serwerem:", error);
    alert("Nie udało się połączyć z serwerem PHP. Upewnij się, że XAMPP działa.");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Dołącz do nas!</h2>
        <p>Stwórz konto, aby odkrywać najpiękniejsze zakątki świata.</p>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Imię i Nazwisko</label>
            <input 
              type="text" 
              placeholder="Jan Kowalski" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="przyklad@poczta.pl" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Hasło</label>
            <input 
              type="password" 
              placeholder="Min. 8 znaków" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength="8"
            />
          </div>

          <button type="submit" className="auth-button">Zarejestruj się</button>
        </form>

        <div className="auth-footer">
          <span>Masz już konto? </span>
          <Link to="/login">Zaloguj się</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;