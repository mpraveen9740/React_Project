function MatchCard({ match, onBook }) {

  return (
    <div className="match-card">

      <div className="match-top">

        <span className="league">
          IPL 2026
        </span>

        <span className="status">
          Upcoming
        </span>

      </div>

      <p className="date">
        {match.date}
      </p>

      <div className="teams">

        <div className="team">
          <div className="team-logo">
            {match.team1Code}
          </div>

          <h2>{match.team1}</h2>
        </div>

        <div className="vs">
          VS
        </div>

        <div className="team">
          <div className="team-logo">
            {match.team2Code}
          </div>

          <h2>{match.team2}</h2>
        </div>

      </div>

      <div className="match-info">

        <p>📍 {match.venue}</p>

        <p>🕒 {match.time}</p>

      </div>

      <button
        className="book-btn"
        onClick={() => onBook(match)}
      >
        Book Tickets
      </button>

    </div>
  );
}

export default MatchCard;