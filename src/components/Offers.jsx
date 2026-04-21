import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
function Offers(){

const [trips,setTrips] = useState([])

useEffect(()=>{

fetch("http://localhost/get_trips.php")
.then(res=>res.json())
.then(data=>{
const shuffled = data.sort(() => 0.5 - Math.random());
setTrips(shuffled.slice(0, 4));})
},[])
const navigate = useNavigate()

function Offers({ filter }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("/data/trips.json")
      .then((res) => res.json())
      .then((data) => {

        if (filter) {
          const filtered = data.filter(trip => 
            trip.country.toLowerCase().includes(filter) || 
            trip.name.toLowerCase().includes(filter)
          );
          setTrips(filtered);
        } else {
          setTrips(data.slice(0, 4));
        }
      });
  }, [filter]); 
}
  return(
    
    <div className="offers">

      <h2>Wyróżnione Oferty</h2>

      <div className="offers-grid">

        {trips.map(trip =>(

          <div className="card" key={trip.id}>
            <div className="image-container">
                <img src={trip.img} alt={trip.country}/>
                <h3 className="trip-title">{trip.name}</h3>
            </div>
            <p className="trip-price">Od {trip.price}</p>
            

            <button onClick={() => navigate(`pages/booking/${trip.id}`)} className="trip-button">Zobacz Szczegóły</button>

          </div>

        ))}

      </div>

    </div>

  )

}

export default Offers