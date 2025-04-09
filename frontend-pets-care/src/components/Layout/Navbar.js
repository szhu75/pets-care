import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo + Nom de l'application */}
        <div className="navbar-logo-container">
          <img src="/images/logo-2-entier.jpg" alt="PetsCare Logo" className="logo" />
          <Link to="/" className="navbar-logo">
            PetsCare
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={toggleMenu}>
              Accueil
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={toggleMenu}>
              À Propos
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Authentication Links */}
        <div className="navbar-auth">
          <Link to="/login" className="btn-login">
            Connexion
          </Link>
          <Link to="/register" className="btn-register">
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
