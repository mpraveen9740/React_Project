import { useState } from "react";
import { supabase } from "./supabase";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import MatchCard from "./components/MatchCard";
import Footer from "./components/Footer";

import "./App.css";

function App() {

  // ================= MATCH DATA =================

  const matches = [

    {
      id: 1,
      team1: "Royal Challengers Bengaluru",
      team1Code: "RCB",
      team2: "Chennai Super Kings",
      team2Code: "CSK",
      date: "25 March 2026",
      time: "7:30 PM",
      venue: "M. Chinnaswamy Stadium",
      price: 1500
    },

    {
      id: 2,
      team1: "Mumbai Indians",
      team1Code: "MI",
      team2: "Kolkata Knight Riders",
      team2Code: "KKR",
      date: "27 March 2026",
      time: "7:30 PM",
      venue: "Wankhede Stadium",
      price: 1200
    },

    {
      id: 3,
      team1: "Sunrisers Hyderabad",
      team1Code: "SRH",
      team2: "Delhi Capitals",
      team2Code: "DC",
      date: "29 March 2026",
      time: "3:30 PM",
      venue: "Rajiv Gandhi Stadium",
      price: 1000
    },

    {
      id: 4,
      team1: "Gujarat Titans",
      team1Code: "GT",
      team2: "Rajasthan Royals",
      team2Code: "RR",
      date: "31 March 2026",
      time: "7:30 PM",
      venue: "Narendra Modi Stadium",
      price: 1800
    },

    {
      id: 5,
      team1: "Punjab Kings",
      team1Code: "PBKS",
      team2: "Lucknow Super Giants",
      team2Code: "LSG",
      date: "2 April 2026",
      time: "7:30 PM",
      venue: "PCA Stadium",
      price: 1100
    },

    {
      id: 6,
      team1: "Royal Challengers Bengaluru",
      team1Code: "RCB",
      team2: "Mumbai Indians",
      team2Code: "MI",
      date: "4 April 2026",
      time: "7:30 PM",
      venue: "M. Chinnaswamy Stadium",
      price: 1600
    }

  ];


  // ================= STATE =================

  const [search, setSearch] = useState("");

  const [selectedMatch, setSelectedMatch] = useState(null);

  const [ticketCount, setTicketCount] = useState(1);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);


  // ================= FILTER MATCHES =================

  const filteredMatches = matches.filter((match) => {

    const searchText = search.toLowerCase();

    return (
      match.team1.toLowerCase().includes(searchText) ||
      match.team2.toLowerCase().includes(searchText) ||
      match.team1Code.toLowerCase().includes(searchText) ||
      match.team2Code.toLowerCase().includes(searchText)
    );

  });


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

// ================= CONFIRM BOOKING =================

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
        name: `${selectedMatch.team1Code} vs ${selectedMatch.team2Code}`,
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

          {filteredMatches.length > 0 ? (

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
                  {selectedMatch.team1Code}
                  {" vs "}
                  {selectedMatch.team2Code}
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
                    {selectedMatch.team1Code}
                    {" vs "}
                    {selectedMatch.team2Code}
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

      <Footer />

    </div>

  );
}

export default App;