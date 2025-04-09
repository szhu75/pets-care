import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">Pets Care</h3>
            <p className="footer-description">
              Votre partenaire de confiance pour la santé et le bien-être de vos animaux.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Liens Rapides</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/dashboard">Tableau de Bord</Link></li>
              <li><Link to="/about">À Propos</Link></li>
            </ul>
          </div>

          {/* Services
          <div className="footer-section">
            <h4 className="footer-subtitle">Nos Services</h4>
            <ul className="footer-links">
              <li><Link to="/services/vaccinations">Vaccinations</Link></li>
              <li><Link to="/services/consultations">Consultations</Link></li>
              <li><Link to="/services/suivi-sante">Suivi Santé</Link></li>
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contactez-nous</h4>
            <div className="footer-contact">
              <p>Email: contact@petscare.com</p>
              <p>Téléphone: 01 23 45 67 89</p>
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">Twitter</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2025 PetsCare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;