import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  // Przykładowe dane (docelowo pobierzesz je z bazy przez useEffect)
  const [tours, setTours] = useState([
    { id: 1, tytul: "Wyprawa w Alpy", miejsce: "Szwajcaria, Alpy", cena: 1200, terminy: "10.07.2024 - 17.07.2024" },
    { id: 2, tytul: "Słoneczne wybrzeże", miejsce: "Chorwacja, Dalmacja", cena: 850, terminy: "01.08.2024 - 08.08.2024" },
  ]);

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <button className="sidebar-btn active">
          <i className="fas fa-th-list"></i> Zarządzaj ofertami
        </button>
        <button className="sidebar-btn">
          <i className="fas fa-calendar-check"></i> Zarządzaj rezerwacjami
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Zarządzaj Ofertami</h1>
          <button className="btn-add">+ Dodaj nową ofertę</button>
        </header>

        <section className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tytuł</th>
                <th>Lokalizacja</th>
                <th>Cena</th>
                <th>Terminy</th>
                <th style={{textAlign: 'right'}}>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td>{tour.tytul}</td>
                  <td>{tour.miejsce}</td>
                  <td>{tour.cena} PLN</td>
                  <td>{tour.terminy}</td>
                  <td className="actions">
                    <button className="btn-edit"><i className="fas fa-edit"></i></button>
                    <button className="btn-delete"><i className="fas fa-trash"></i></button>
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