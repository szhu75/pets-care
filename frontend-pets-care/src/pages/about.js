import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <main className="about-container">
        <section className="about-hero">
          <h1 className="about-hero-title">Notre Histoire</h1>
          <p className="about-hero-subtitle">Une passion pour la santé et le bien-être des animaux</p>
        </section>

        <section className="about-mission">
          <div className="about-mission-content">
            <h2>Notre Mission</h2>
            <p>
              Chez Pets Care, nous croyons que chaque animal mérite des soins de qualité, 
              attentifs et personnalisés. Notre mission est de fournir un accompagnement 
              complet tout au long de la vie de votre compagnon, en combinant expertise 
              médicale et approche bienveillante.
            </p>
          </div>
        </section>

        <section className="about-team">
          <h2>Notre Équipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-photo">
                <img src="/images/doc3.PNG" alt="Dr. Sophie Martin" />
              </div>
              <h3>Dr. Carla Martin</h3>
              <p>Fondatrice et Vétérinaire en Chef</p>
            </div>
            <div className="team-member">
              <div className="team-member-photo">
                <img src="/images/doc2.PNG" alt="Dr. Julien Dupont" />
              </div>
              <h3>Dr. Julien Dupont</h3>
              <p>Spécialiste en Médecine Animale</p>
            </div>
            <div className="team-member">
              <div className="team-member-photo">
                <img src="/images/doc1.PNG" alt="Emma Lefebvre" />
              </div>
              <h3>Emma Lefebvre</h3>
              <p>Responsable des Soins et du Bien-être</p>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2>Nos Valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Compassion</h3>
              <p>Nous traitons chaque animal avec amour et respect.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🏆</div>
              <h3>Excellence</h3>
              <p>Nous nous engageons à fournir des soins de la plus haute qualité.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Transparence</h3>
              <p>Nous communiquons ouvertement et honnêtement.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌿</div>
              <h3>Innovation</h3>
              <p>Nous restons à la pointe des dernières avancées médicales.</p>
            </div>
          </div>
        </section>

        <section className="about-contact">
          <h2>Nous Contacter</h2>
          <div className="contact-info">
            <p>📍 123 Rue des Animaux, 75000 Paris</p>
            <p>📞 01 23 45 67 89</p>
            <p>✉️ contact@petscare.com</p>
            <div className="contact-hours">
              <h3>Heures d'ouverture</h3>
              <p>Lundi - Vendredi : 9h - 19h</p>
              <p>Samedi : 10h - 16h</p>
              <p>Dimanche : Fermé</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;