import { useState } from "react";

function AdminPanel() {
  const [formData, setFormData] = useState({
    tytul: "",
    miejsce: "",
    cena: "",
    opis: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tutaj w przyszłości dodamy fetch do add_trip.php
    console.log("Dodawanie wycieczki:", formData);
    alert("Funkcja dodawania będzie połączona z PHP w następnym kroku!");
  };

  return (
    <div className="admin-panel" style={{ padding: "20px" }}>
      <h2>Panel Administratora</h2>
      <div className="admin-card">
        <h3>Dodaj nową wycieczkę</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Tytuł wycieczki" 
            onChange={(e) => setFormData({...formData, tytul: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="Miejsce" 
            onChange={(e) => setFormData({...formData, miejsce: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Cena" 
            onChange={(e) => setFormData({...formData, cena: e.target.value})} 
          />
          <textarea 
            placeholder="Opis" 
            onChange={(e) => setFormData({...formData, opis: e.target.value})} 
          />
          <button type="submit">Dodaj wycieczkę</button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;