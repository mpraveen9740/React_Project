import { useEffect,useState } from "react";
import { supabase } from "./supabase";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import MatchCard from "./components/MatchCard";
import Footer from "./components/Footer";

import "./App.css";

function App() {

  // ================= MATCH DATA =================

const [matches, setMatches] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching matches:", error);
      setLoading(false);
      return;
    }

    setMatches(data || []);
    setLoading(false);
  };

  fetchMatches();
}, []);

  // ================= STATE =================

  const [search, setSearch] = useState("");

  const [selectedMatch, setSelectedMatch] = useState(null);

  const [ticketCount, setTicketCount] = useState(1);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);


  // ================= FILTER MATCHES =================

const filteredMatches = matches.filter((match) =>
  match.team1.toLowerCase().includes(search.toLowerCase()) ||
  match.team2.toLowerCase().includes(search.toLowerCase()) ||
  match.team1_code.toLowerCase().includes(search.toLowerCase()) ||
  match.team2_code.toLowerCase().includes(search.toLowerCase())
);


  // ================= EXPLORE MATCHES =================

  const exploreMatches = () => {

    document
      .getElementById("matches")
      .scrollIntoView({
        behavior: "smooth"
      });

  };


  // ================= BOOK TICKET =================

  const bookTicket = (match) => {

    setSelectedMatch(match);

    setTicketCount(1);

    setSelectedSeats([]);

    setBookingConfirmed(false);

  };


  // ================= SEAT SELECTION =================

  const toggleSeat = (seat) => {

    if (selectedSeats.includes(seat)) {

      setSelectedSeats(
        selectedSeats.filter(
          (selected) => selected !== seat
        )
      );

    } else {

      if (selectedSeats.length < ticketCount) {

        setSelectedSeats([
          ...selectedSeats,
          seat
        ]);

      }

    }

  };


  // ================= INCREASE TICKETS =================

  const increaseTickets = () => {

    setTicketCount(ticketCount + 1);

  };


  // ================= DECREASE TICKETS =================

  const decreaseTickets = () => {

    const newCount =
      Math.max(1, ticketCount - 1);

    setTicketCount(newCount);

    setSelectedSeats(
      selectedSeats.slice(0, newCount)
    );

  };


  // ================= CONFIRM BOOKING =================

const confirmBooking = async () => {

  if (selectedSeats.length !== ticketCount) {
    alert(`Please select ${ticketCount} seat(s).`);
    return;
  }

  const { error } = await supabase
    .from("bookings")
    .insert([
      {
        name: `${selectedMatch.team1_code} vs ${selectedMatch.team2_code}`,
        tickets: ticketCount,
        stand: selectedSeats.join(", "),
        venue: selectedMatch.venue
      }
    ]);

  if (error) {
    console.error("Booking error:", error);
    alert("Booking failed. Please try again.");
    return;
  }

  setBookingConfirmed(true);
};

  // ================= CLOSE MODAL =================

  const closeModal = () => {

    setSelectedMatch(null);

    setBookingConfirmed(false);

    setSelectedSeats([]);

    setTicketCount(1);

  };


  // ================= UI =================

  return (

    <div className="app">

      {/* NAVBAR */}

      <Navbar />


      {/* HERO */}

      <Hero
        onExplore={exploreMatches}
      />


      {/* MATCHES */}

      <main
        className="matches-section"
        id="matches"
      >

        <div className="section-heading">

          <div>

            <p className="section-label">
              UPCOMING GAMES
            </p>

            <h1>
              Upcoming IPL Matches
            </h1>

          </div>


          <SearchBar
            search={search}
            setSearch={setSearch}
          />

        </div>


        <div className="matches-grid">

          {loading ? (
            <p className="no-results">
              Loading matches...
            </p>
          ) : filteredMatches.length > 0 ? (

            filteredMatches.map((match) => (

              <MatchCard
                key={match.id}
                match={match}
                onBook={bookTicket}
              />

            ))

          ) : (

            <p className="no-results">
              No matches found.
            </p>

          )}

        </div>

      </main>


      {/* ================= BOOKING MODAL ================= */}

      {selectedMatch && (

        <div className="modal-overlay">

          <div className="modal">

            {!bookingConfirmed ? (

              <>

                {/* CLOSE BUTTON */}

                <button
                  className="close-btn"
                  onClick={closeModal}
                >
                  ×
                </button>


                {/* TITLE */}

                <h2>
                  🎟️ Ticket Booking
                </h2>


                <p>
                  You selected:
                </p>


                {/* TEAMS */}

                <h3>
                  {selectedMatch.team1_code}
                  {" vs "}
                  {selectedMatch.team2_code}
                </h3>


                {/* MATCH DETAILS */}

                <p>
                  📍 {selectedMatch.venue}
                </p>

                <p>
                  📅 {selectedMatch.date}
                </p>

                <p>
                  🕒 {selectedMatch.time}
                </p>


                {/* PRICE */}

                <p>
                  Ticket Price:
                  {" "}
                  ₹{selectedMatch.price}
                </p>


                {/* TICKET QUANTITY */}

                <h4>
                  Number of Tickets
                </h4>

                <div className="quantity">

                  <button
                    onClick={decreaseTickets}
                  >
                    −
                  </button>

                  <span>
                    {ticketCount}
                  </span>

                  <button
                    onClick={increaseTickets}
                  >
                    +
                  </button>

                </div>


                {/* SEAT SELECTION */}

                <h4 className="seat-title">
                  Select Your Seats
                </h4>


                <div className="seat-grid">

                  {[
                    "A1", "A2", "A3", "A4",
                    "B1", "B2", "B3", "B4",
                    "C1", "C2", "C3", "C4"
                  ].map((seat) => (

                    <button
                      key={seat}
                      className={
                        selectedSeats.includes(seat)
                          ? "seat selected"
                          : "seat"
                      }
                      onClick={() =>
                        toggleSeat(seat)
                      }
                    >
                      {seat}
                    </button>

                  ))}

                </div>


                {/* SELECTED SEATS */}

                <p className="selected-seat-text">

                  Selected Seats:

                  {selectedSeats.length > 0
                    ? ` ${selectedSeats.join(", ")}`
                    : " None"
                  }

                </p>


                {/* TOTAL */}

                <h3>
                  Total: ₹
                  {selectedMatch.price * ticketCount}
                </h3>


                {/* CONFIRM */}

                <button
                  className="confirm-btn"
                  onClick={confirmBooking}
                >
                  Confirm Booking
                </button>

              </>

            ) : (

              /* ================= SUCCESS SCREEN ================= */

              <div className="success-screen">

                <div className="success-icon">
                  ✓
                </div>


                <h2>
                  Booking Confirmed!
                </h2>


                <p>
                  Your IPL tickets have been
                  successfully booked.
                </p>


                <div className="booking-summary">

                  <h3>
                    {selectedMatch.team1_code}
                    {" vs "}
                    {selectedMatch.team2_code}
                  </h3>


                  <p>
                    📅 {selectedMatch.date}
                  </p>


                  <p>
                    📍 {selectedMatch.venue}
                  </p>


                  <p>
                    🕒 {selectedMatch.time}
                  </p>


                  <p>
                    🎟️ Tickets: {ticketCount}
                  </p>


                  <p>
                    💺 Seats:
                    {" "}
                    {selectedSeats.join(", ")}
                  </p>


                  <h3>
                    Total: ₹
                    {selectedMatch.price * ticketCount}
                  </h3>

                </div>


                <button
                  className="confirm-btn"
                  onClick={closeModal}
                >
                  Done
                </button>

              </div>

            )}

          </div>

        </div>

      )}


      {/* FOOTER */}

          {/* FOOTER */}

      <Footer />

    </div>
  );
}

export default App;