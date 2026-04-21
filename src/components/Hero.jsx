import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (destination.trim() !== "") {

      navigate(`/search?query=${destination}`);
    } else {

      navigate("/search");
    }
  };
  return (
    <div className="hero">
      <div className="hero-overlay">
        <h1>Odkryj Świat z Travel Explorer</h1>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Gdzie chcesz lecieć?" 
            onChange={(e) => setDestination(e.target.value)}
          />

          <button className="Search-button" onClick={handleSearch}>
            Szukaj
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;