import { useState, useEffect } from "react";

function AllTestimonials() {
  const [reviews, setReviews] = useState([]);
  

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newRating, setNewRating] = useState(5);


useEffect(() => {
  const localData = localStorage.getItem("my_custom_reviews");
  const savedReviews = localData ? JSON.parse(localData) : [];

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
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();

  const reviewToSend = {
    name: newName,
    rating: parseInt(newRating),
    description: newDesc // PHP spodziewa się 'description'
  };

  try {
    const res = await fetch("http://localhost/manage_reviews.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewToSend)
    });

    const result = await res.json();

    if (result.success) {
      // Opcja A: Ponowne pobranie wszystkich opinii z bazy (najbezpieczniejsze)
      const refreshRes = await fetch("http://localhost/get_testimonials.php");
      const newData = await refreshRes.json();
      const mappedData = newData.map(item => ({
        ...item,
        desc: item.description 
      }));
      setReviews(mappedData);

      // Czyszczenie formularza
      setNewName("");
      setNewDesc("");
      setNewRating(5);
      alert("Opinia została dodana!");
    } else {
      alert("Błąd serwera: " + result.error);
    }
  } catch (err) {
    console.error("Błąd wysyłania:", err);
    alert("Nie udało się połączyć z serwerem.");
  }
};
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="all-testimonials-page">
      <section className="add-review-section">
        <h2>Podziel się swoją opinią</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <input 
            type="text" 
            placeholder="Twoje imię" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required 
          />
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
          <button type="submit" className="auth-button">Dodaj opinię</button>
        </form>
      </section>

      <hr className="divider" />

      <section className="reviews-gallery-section">
  <h2>Co mówią nasi podróżnicy</h2>
  <div className="reviews-gallery">
    {reviews.map((review) => (
      <div className="review-card" key={review.id}>
        <div className="card-header">
          <img className="user-img" src={review.img} alt={review.name} />
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