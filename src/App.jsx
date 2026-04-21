import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Hero from "./components/Hero";
import Offers from "./components/Offers";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Profile from "./pages/Profile"; // 1. IMPORTUJEMY PROFIL
import AllTestimonials from "./pages/AllTestimonials";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

// Komponent Home (Strona główna)
function Home() {
  return (
    <>
      <Hero />
      <Offers />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/testimonials" element={<AllTestimonials />} />
        
        {/* 2. DODAJEMY TRASĘ PROFILU */}
        <Route path="/profile" element={<Profile />} />

        {/* Poprawiona ścieżka do bookowania (bez /pages/) */}
        <Route path="/booking/:id" element={<Booking />} />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;