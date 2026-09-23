function Hero({ onExplore }) {
  return (
    <section className="hero" id="home">

      <div className="hero-content">

        <p className="hero-small">
          🏏 INDIAN PREMIER LEAGUE
        </p>

        <h1>
          Experience Cricket
          <br />
          <span>Live in the Stadium</span>
        </h1>

        <p className="hero-description">
          Book your IPL tickets and experience
          the excitement of live cricket.
        </p>

        <button
          className="explore-btn"
          onClick={onExplore}
        >
          Explore Matches →
        </button>

      </div>

    </section>
  );
}

export default Hero;