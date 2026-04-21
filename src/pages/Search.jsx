import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Search() {
  const [allTrips, setAllTrips] = useState([]);
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query")?.toLowerCase() || "";


  const [minPrice, setMinPrice] = useState(0); 
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minDays, setMinDays] = useState(1);

  useEffect(() => {
    fetch("http://localhost/get_trips.php")
      .then((res) => res.json())
      .then((data) => setAllTrips(data));
  }, []);

  useEffect(() => {
    let filtered = allTrips.filter(trip => 
      trip.country.toLowerCase().includes(searchTerm) || 
      trip.name.toLowerCase().includes(searchTerm)
    );


    filtered = filtered.filter(trip => {
      const priceNum = parseInt(trip.price.replace(/[^0-9]/g, ""));
      return priceNum >= minPrice && priceNum <= maxPrice;
    });


    filtered = filtered.filter(trip => trip.days >= minDays);

    setResults(filtered);
  }, [searchTerm, allTrips, minPrice, maxPrice, minDays]);

  return (
    <div className="search-page-layout">
      <aside className="filters-sidebar">
        <h3>Filtruj wyniki</h3>
        
        <div className="filter-group">
          <label>Cena od: <strong>{minPrice} zł</strong></label>
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="100"
            value={minPrice}
            onChange={(e) => setMinPrice(parseInt(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>Cena do: <strong>{maxPrice} zł</strong></label>
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          />
        </div>

        <div className="filter-group">
          <label>Min. liczba dni: <strong>{minDays}</strong></label>
          <input 
            type="number" 
            min="1"
            value={minDays}
            onChange={(e) => setMinDays(parseInt(e.target.value))}
          />
        </div>
        
        <button className="reset-filters" onClick={() => {
          setMinPrice(0);
          setMaxPrice(20000);
          setMinDays(1);
        }}>
          Resetuj filtry
        </button>
      </aside>

      <div className="search-content">
        <h2>Wyniki wyszukiwania dla: "{searchTerm || "Wszystkie kierunki"}"</h2>
        <div className="offers-grid">
          {results.length > 0 ? (
            results.map((trip) => (
              <div className="card" key={trip.id}>
                <div className="image-container">
                  <img src={trip.img} alt={trip.country}/>
                  <h3 className="trip-title">{trip.name}</h3>
                </div>
                <p className="trip-price">Od {trip.price}</p>
                <button onClick={() => navigate(`/pages/booking/${trip.id}`)} className="trip-button">
                  Zobacz Szczegóły
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">Brak ofert w tym zakresie cenowym.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;