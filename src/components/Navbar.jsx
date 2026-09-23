function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        IPL<span>BOOK</span>
      </div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#matches">Matches</a>
        <a href="#about">About</a>

        <button className="login-btn">
          Login
        </button>
      </div>

    </nav>
  );
}

export default Navbar;