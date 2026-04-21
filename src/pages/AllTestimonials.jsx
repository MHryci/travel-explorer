import { useState, useEffect } from "react";

function AllTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [newDesc, setNewDesc] = useState("");
  const [newRating, setNewRating] = useState(5);

  // 1. Pobieramy dane zalogowanego użytkownika z localStorage
  const getUserData = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const currentUser = getUserData();
  const loggedInUsername = currentUser ? currentUser.username : null;

  // Funkcja pobierająca opinie
  const fetchReviews = () => {
    fetch("http://localhost/get_testimonials.php")
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map(item => ({
          ...item,
          desc: item.description 
        }));
        setReviews(mappedData);
      })
      .catch((err) => console.error("Błąd ładowania opinii:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUsername) {
      alert("Musisz być zalogowany, aby dodać opinię!");
      return;
    }

    const reviewToSend = {
      name: loggedInUsername, // Imię z systemu logowania
      rating: parseInt(newRating),
      description: newDesc
    };

    try {
      const res = await fetch("http://localhost/manage_reviews.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewToSend)
      });

      const result = await res.json();

      if (result.success) {
        alert(result.message || "Opinia zapisana!");
        fetchReviews(); // Odśwież listę, aby zobaczyć zmiany
        setNewDesc(""); // Czyścimy tylko tekst
      } else {
        alert("Błąd: " + result.error);
      }
    } catch (err) {
      console.error("Błąd wysyłania:", err);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Sprawdzamy, czy ten użytkownik ma już opinię
  const hasReview = reviews.some(r => r.name === loggedInUsername);

  return (
    <div className="all-testimonials-page">
      <section className="add-review-section">
        {loggedInUsername ? (
          <>
            <h2>{hasReview ? "Twoja opinia" : "Podziel się swoją opinią"}</h2>
            <p>Zalogowany jako: <strong>{loggedInUsername}</strong></p>
            {hasReview && <p style={{color: '#888', fontSize: '0.8rem'}}>Dodanie nowej treści zaktualizuje Twoją poprzednią opinię.</p>}
            
            <form onSubmit={handleSubmit} className="review-form">
              <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
                <option value="5">5 Gwiazdek</option>
                <option value="4">4 Gwiazdki</option>
                <option value="3">3 Gwiazdki</option>
                <option value="2">2 Gwiazdki</option>
                <option value="1">1 Gwiazdka</option>
              </select>
              <textarea 
                placeholder="Napisz co myślisz o naszych usługach..." 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="auth-button">
                {hasReview ? "Zaktualizuj opinię" : "Dodaj opinię"}
              </button>
            </form>
          </>
        ) : (
          <div className="login-notice">
            <h2>Chcesz dodać opinię?</h2>
            <p>Musisz się zalogować, aby ocenić nasze usługi.</p>
          </div>
        )}
      </section>

      <hr className="divider" />

      <section className="reviews-gallery-section">
        <h2>Co mówią nasi podróżnicy</h2>
        <div className="reviews-gallery">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="card-header">
                <img 
                  className="user-img" 
                  src={review.img || `https://ui-avatars.com/api/?name=${review.name}`} 
                  alt={review.name} 
                />
                <div className="user-info">
                  <h4>{review.name}</h4>
                  <div className="stars-mini">{renderStars(review.rating)}</div>
                </div>
              </div>
              <div className="card-body">
                <p>"{review.desc}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AllTestimonials;