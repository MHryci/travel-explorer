import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Booking() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pobieramy dane użytkownika z localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleBook = async () => {
    // 1. Sprawdzamy czy użytkownik jest zalogowany
    if (!userData) {
      alert("Musisz się zalogować, aby zarezerwować wycieczkę!");
      navigate("/login"); // Opcjonalnie przekieruj do logowania
      return;
    }

    // 2. Wysyłamy prośbę o rezerwację
    try {
      const response = await fetch("http://localhost/manage_bookings.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.id,
          trip_id: trip.id // Używamy trip.id z aktualnie załadowanej wycieczki
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Sukces! Wycieczka została zarezerwowana.");
        navigate("/profile"); // Przekieruj do profilu po sukcesie
      } else {
        alert(data.message || "Błąd rezerwacji.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      alert("Problem z połączeniem z serwerem.");
    }
  };

  useEffect(() => {
    fetch("http://localhost/get_trips.php")
      .then((res) => res.json())
      .then((data) => {
        const foundTrip = data.find(t => String(t.id) === String(id));
        setTrip(foundTrip);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd ładowania danych:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Ładowanie szczegółów...</p>;

  if (!trip) {
    return (
      <div className="error-page">
        <h2>Ups! Nie znaleźliśmy takiej wycieczki.</h2>
        <button onClick={() => navigate("/")}>Wróć do ofert</button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <button onClick={() => navigate(-1)} className="back-button">← Powrót</button>
      
      <div className="trip-header">
        <h1>{trip.name}</h1>
        <p className="location">{trip.country}</p>
      </div>

      <div className="trip-content">
        <img src={trip.img} alt={trip.name} className="detail-image" />
        
        <div className="trip-info">
          <h3>Szczegóły:</h3>
          <p>Czas trwania: {trip.days} dni</p>
          <p style={{color: '#427FFAFF', fontWeight: 'bold', fontSize: '24px'}}>
            Cena: {trip.price} PLN
          </p>
          
          <div className="booking-form" style={{background: '#3252bb', padding: '20px', borderRadius: '10px'}}>
            <h3>Zarezerwuj teraz</h3>
            
            {userData ? (
              <div className="user-confirm-info" style={{marginBottom: '15px'}}>
                <p>Rezerwujesz jako: <strong>{userData.username}</strong></p>
                <p style={{fontSize: '0.9rem', color: '#666'}}>Email: {userData.email}</p>
                <button onClick={handleBook} className="book-button">
                   Potwierdzam rezerwację
                </button>
              </div>
            ) : (
              <div className="login-prompt">
                <p>Aby dokonać rezerwacji, musisz być zalogowany.</p>
                <button onClick={() => navigate("/login")} className="book-button">
                  Zaloguj się
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;