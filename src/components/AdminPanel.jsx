import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [tours, setTours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  // Zmienione na angielskie nazwy pól
  const [newTour, setNewTour] = useState({ title: '', location: '', price: '', dates: '' });

  const fetchTours = async () => {
    const res = await fetch("http://localhost/get_trips.php");
    const data = await res.json();
    setTours(data);
  };

  useEffect(() => { fetchTours(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/manage_trips.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTour)
    });
    const result = await res.json();
    if (result.success) {
      fetchTours();
      setShowForm(false);
      setNewTour({ title: '', location: '', price: '', dates: '' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      await fetch(`http://localhost/manage_trips.php?id=${id}`, { method: "DELETE" });
      fetchTours();
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <button className="sidebar-btn active">Manage Offers</button>
        <button className="sidebar-btn">Bookings</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>Manage Tours</h1>
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add New Offer"}
          </button>
        </header>

        {showForm && (
          <form className="admin-form" onSubmit={handleAdd}>
            <input placeholder="Title" value={newTour.title} onChange={e => setNewTour({...newTour, title: e.target.value})} required />
            <input placeholder="Location" value={newTour.location} onChange={e => setNewTour({...newTour, location: e.target.value})} required />
            <input type="number" placeholder="Price" value={newTour.price} onChange={e => setNewTour({...newTour, price: e.target.value})} required />
            <input placeholder="Dates (e.g. 10.05 - 20.05)" value={newTour.dates} onChange={e => setNewTour({...newTour, dates: e.target.value})} required />
            <button type="submit" className="btn-save">Save Offer</button>
          </form>
        )}

        <section className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Location</th><th>Price</th><th>Dates</th><th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>{tour.title}</td>
                  <td>{tour.location}</td>
                  <td>{tour.price}</td> 
                  <td>{tour.dates}</td>
                  <td className="actions">
                    <button className="btn-delete" onClick={() => handleDelete(tour.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;