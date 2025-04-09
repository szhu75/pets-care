import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import '../styles/index.css';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main className="home-container">
      

        {/* Section Hero */}
        <div className="home-hero">
          <h1 className="home-hero-title fade-in">Bienvenue sur PetsCare</h1>
          <p className="home-hero-subtitle fade-in">Votre partenaire de confiance pour la santé de vos animaux</p>
          <p className="home-intro-text">
            L'application qui permet de gérer la santé de nos amis à quatre pattes !
          </p>
          <p className="home-intro-text">
            Notre application vous aide à prendre soin de vos animaux de compagnie en offrant divers services.
          </p>
        </div>

        {/* Nos Services */}
        <div className="home-services">
          <h2>Nos Services Essentiels</h2>
          <div className="home-services-grid">
            <div className="home-service-card">
              <div className="service-icon">🩺</div>
              <h3>Vaccinations</h3>
              <p>Protections complètes et personnalisées pour chaque animal</p>
            </div>
            <div className="home-service-card">
              <div className="service-icon">📅</div>
              <h3>Consultations</h3>
              <p>Rendez-vous rapides et adaptés à vos besoins spécifiques</p>
            </div>
            <div className="home-service-card">
              <div className="service-icon">❤️</div>
              <h3>Suivi Santé</h3>
              <p>Accompagnement personnalisé tout au long de la vie de votre animal</p>
            </div>
          </div>
        </div>

        {/* Témoignages */}
        <div className="home-testimonials">
          <h2>Témoignages de nos clients</h2>
          <div className="home-testimonial-grid">
            <div className="home-testimonial-card">
              <p className="testimonial-text">"Un service exceptionnel qui a changé la vie de mon chat. Je recommande Pets Care à tous les propriétaires d'animaux !"</p>
              <div className="testimonial-author">
                <span className="author-name">Marie D.</span>
                <span className="author-pet">Propriétaire de Minou</span>
              </div>
            </div>
            <div className="home-testimonial-card">
              <p className="testimonial-text">"La prise de rendez-vous est simple et rapide. Mes chiens sont entre de bonnes mains avec Pets Care."</p>
              <div className="testimonial-author">
                <span className="author-name">Thomas R.</span>
                <span className="author-pet">Propriétaire de Rex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="home-cta">
          <h2>Votre animal mérite le meilleur</h2>
          <p>Rejoignez notre communauté et offrez une santé optimale à votre compagnon</p>
          <Link to="/register" className="btn-primary">Inscription Gratuite</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
