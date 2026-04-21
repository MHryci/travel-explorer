import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Booking() {
  const { id } = useParams(); 
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          Cena: {trip.price}
        </p>
        
        <div className="booking-form">
          <h3>Zarezerwuj miejsce</h3>
          <input type="text" placeholder="Imię i Nazwisko" />
          <input type="email" placeholder="Email" />
          <button className="confirm-button">Rezerwuję!</button>
        </div>
      </div>
    </div>
  </div>
);
}

export default Booking;