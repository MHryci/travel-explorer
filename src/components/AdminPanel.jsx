import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' lub 'reviews'
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTour, setNewTour] = useState({ name: '', country: '', price: '', days: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // POBIERANIE DANYCH
  const fetchData = async () => {
    try {
      const tripsRes = await fetch("http://localhost/get_trips.php");
      setTours(await tripsRes.json());
      
      const reviewsRes = await fetch("http://localhost/manage_reviews.php");
      setReviews(await reviewsRes.json());
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LOGIKA OFERT (TOURS) ---
  const handleAddTour = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/manage_trips.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTour)
    });
    const result = await res.json();
    if (result.success) {
      fetchData();
      setShowForm(false);
      setNewTour({ name: '', country: '', price: '', days: '' });
    }
  };

  const deleteTour = async (id) => {
    if (window.confirm("Usunąć tę wycieczkę?")) {
      await fetch(`http://localhost/manage_trips.php?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  // --- LOGIKA OPINII (REVIEWS/TESTIMONIALS) ---
  const deleteReview = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę opinię z tabeli testimonials?")) {
      await fetch(`http://localhost/manage_reviews.php?id=${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  // SORTOWANIE OFERT
  const sortedTours = [...tours].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    if (sortConfig.key === 'price' || sortConfig.key === 'days') {
      aVal = parseFloat(String(aVal).replace(/[^\d.-]/g, '')) || 0;
      bVal = parseFloat(String(bVal).replace(/[^\d.-]/g, '')) || 0;
    }
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <button 
          className={`sidebar-btn ${activeTab === 'tours' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tours')}
        >
         Zarządzaj Ofertami
        </button>
        <button 
          className={`sidebar-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
          onClick={() => setActiveTab('reviews')}
        >
          Opinie
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {activeTab === 'tours' ? (
          <section>
            <header className="admin-header">
              <h1>Zarządzaj Ofertami</h1>
              <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Anuluj" : "+ Dodaj nową"}
              </button>
            </header>

            {showForm && (
              <form className="admin-form" onSubmit={handleAddTour}>
                <input placeholder="Nazwa" value={newTour.name} onChange={e => setNewTour({...newTour, name: e.target.value})} required />
                <input placeholder="Kraj" value={newTour.country} onChange={e => setNewTour({...newTour, country: e.target.value})} required />
                <input type="number" placeholder="Cena" value={newTour.price} onChange={e => setNewTour({...newTour, price: e.target.value})} required />
                <input placeholder="Dni (liczba)" value={newTour.days} onChange={e => setNewTour({...newTour, days: e.target.value})} required />
                <button type="submit" className="btn-save">Zapisz</button>
              </form>
            )}

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => setSortConfig({key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})} className="sortable">Tytuł</th>
                    <th onClick={() => setSortConfig({key: 'country', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})} className="sortable">Kraj</th>
                    <th onClick={() => setSortConfig({key: 'price', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})} className="sortable">Cena</th>
                    <th onClick={() => setSortConfig({key: 'days', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})} className="sortable">Dni</th>
                    <th style={{textAlign: 'right'}}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTours.map(tour => (
                    <tr key={tour.id}>
                      <td>{tour.name}</td>
                      <td>{tour.country}</td>
                      <td>{tour.price}</td>
                      <td>{tour.days}</td>
                      <td className="actions">
                        <button className="btn-delete" onClick={() => deleteTour(tour.id)}><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section>
            <header className="admin-header">
              <h1>Opinie Klientów</h1>
            </header>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Użytkownik</th>
                    <th>Ocena</th>
                    <th>Opis</th>
                    <th style={{textAlign: 'right'}}>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(rev => (
                    <tr key={rev.id}>
                      <td>
                        <img src={rev.img} alt="user" className="admin-avatar" />
                      </td>
                      <td>{rev.name}</td>
                      <td style={{color: '#f59e0b'}}>{'★'.repeat(rev.rating)}</td>
                      <td className="comment-cell" title={rev.description}>{rev.description}</td>
                      <td className="actions">
                        <button className="btn-delete" onClick={() => deleteReview(rev.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;