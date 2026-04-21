import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [tours, setTours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTour, setNewTour] = useState({ name: '', country: '', price: '', days: '' });
  
  // NOWE: Stan sortowania
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const fetchTours = async () => {
    const res = await fetch("http://localhost/get_trips.php");
    const data = await res.json();
    setTours(data);
  };

  useEffect(() => { fetchTours(); }, []);

  // LOGIKA SORTOWANIA
  const sortedTours = [...tours].sort((a, b) => {
  let aValue = a[sortConfig.key];
  let bValue = b[sortConfig.key];

  // Wymuszamy zamianę na liczby dla kolumn numerycznych
  if (sortConfig.key === 'price' || sortConfig.key === 'days') {
    // parseFloat usunie też ewentualne " zł" czy " PLN" jeśli tam są
    aValue = parseFloat(String(aValue).replace(/[^\d.-]/g, '')) || 0;
    bValue = parseFloat(String(bValue).replace(/[^\d.-]/g, '')) || 0;
  } else {
    // Dla nazw (tekstu) ignorujemy wielkość liter
    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();
  }

  if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
  return 0;
});

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Reszta funkcji (handleAdd, handleDelete) pozostaje bez zmian...
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
      setNewTour({ name: '', country: '', price: '', days: '' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
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
            <input placeholder="Name" value={newTour.name} onChange={e => setNewTour({...newTour, name: e.target.value})} required />
            <input placeholder="Country" value={newTour.country} onChange={e => setNewTour({...newTour, country: e.target.value})} required />
            <input type="number" placeholder="Price" value={newTour.price} onChange={e => setNewTour({...newTour, price: e.target.value})} required />
            <input type="number" placeholder="Days" value={newTour.days} onChange={e => setNewTour({...newTour, days: e.target.value})} required />
            <button type="submit" className="btn-save">Save Offer</button>
          </form>
        )}

        <section className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {/* Nagłówki z funkcją sortowania */}
                <th onClick={() => requestSort('name')} className="sortable">
                  Title {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => requestSort('country')} className="sortable">
                  Location {sortConfig.key === 'country' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => requestSort('price')} className="sortable">
                  Price {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => requestSort('days')} className="sortable">
                  Days {sortConfig.key === 'days' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTours.map((tour) => (
                <tr key={tour.id}>
                  <td>{tour.name}</td>
                  <td>{tour.country}</td>
                  <td>{tour.price}</td>
                  <td>{tour.days}</td>
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