import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Nusrat International
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/#travel">Travel</Link></li>
          <li><Link to="/#hajj">Hajj</Link></li>
          <li><Link to="/#umrah">Umrah</Link></li>
          <li><Link to="/#work">Work</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
