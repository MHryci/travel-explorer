import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Testimonials() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
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
  

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <section className="testimonials">
      <h2>Co Mówią Nasi Klienci</h2>
      <div className="testimonials-grid">
        {reviews.map((review) => (
          <div className="review" key={review.id}>
            <img className="avatar" src={review.img} alt={review.name} />

            <div className="rating-stars">
              {renderStars(review.rating)}
            </div>

            <h4>{review.name}</h4>
            <p className="review-text">"{review.desc}"</p>
          </div>
        ))}
        
      </div>
<div style={{ textAlign: 'center', marginTop: '40px' }}>
  <button 
    onClick={() => navigate("/testimonials")} 
    className="secondary-button"
  >
    Zobacz wszystkie opinie
  </button>
</div>
    </section>
  );
}

export default Testimonials;