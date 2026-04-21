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
import AllTestimonials from "./pages/AllTestimonials";
import "./App.css";


function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (filters) => {

    setSearchQuery(filters.destination.toLowerCase());
  };
  return (
    <>
      <Hero onSearch={handleSearch} />
      <Offers filter={searchQuery} />
    </>
  );
}
function App(){

  return(

    <div>

      <Navbar/>

      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/search" element={<Search />} />
      <Route path="/testimonials" element={<AllTestimonials />} />
        <Route path="/" element={
          <>
            <Hero/>
            <Offers/>
            <Testimonials/>
          </>
        }/>

        <Route path="/" element={<Offers/>}/>
        <Route path="/pages/booking/:id" element={<Booking/>}/>

      </Routes>

      <Footer/>

    </div>

  )

}

export default App