import { useState, useEffect } from "react";

function Profile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pobieramy dane zalogowanego użytkownika
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userData && userData.id) {
      fetch(`http://localhost/manage_bookings.php?user_id=${userData.id}`)
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(err => console.error("Błąd:", err));
    }
  }, []);

  if (!userData) return <div className="container">Zaloguj się, aby zobaczyć profil.</div>;

  return (
    <div className="profile-page container" style={{padding: '40px 20px'}}>
      <div className="profile-header" style={{marginBottom: '40px', textAlign: 'center'}}>
        <h1>Witaj, {userData.username}!</h1>
        <p>Email: {userData.email} | Rola: {userData.role}</p>
      </div>

      <section className="my-bookings">
        <h2>Twoje zarezerwowane wycieczki</h2>
        {loading ? (
          <p>Ładowanie rezerwacji...</p>
        ) : bookings.length > 0 ? (
          <div className="bookings-list" style={{display: 'grid', gap: '20px'}}>
            {bookings.map(booking => (
              <div key={booking.booking_id} className="booking-card" style={{
                display: 'flex', 
                background: '#f8f9fa', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img src={booking.img} alt={booking.name} style={{width: '150px', objectFit: 'cover'}} />
                <div style={{padding: '20px'}}>
                  <h3>{booking.name} ({booking.country})</h3>
                  <p>Data rezerwacji: {new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p>Status: <span style={{color: 'green', fontWeight: 'bold'}}>{booking.status}</span></p>
                  <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{booking.price} PLN</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '40px', background: '#eee', borderRadius: '12px'}}>
            <p>Nie masz jeszcze żadnych rezerwacji.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;