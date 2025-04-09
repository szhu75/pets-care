import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    email: '',
    phone: '',
    subject: 'Consultation',
    message: '',
    mathAnswer: ''
  });
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRandomCalculation();
  }, []);

  const generateRandomCalculation = () => {
    const operators = ['+', '-', '*'];
    const randomOperator = operators[Math.floor(Math.random() * operators.length)];
    const randomNum1 = Math.floor(Math.random() * 10) + 1;
    const randomNum2 = Math.floor(Math.random() * 10) + 1;

    setNum1(randomNum1);
    setNum2(randomNum2);
    setOperator(randomOperator);

    let answer;
    switch (randomOperator) {
      case '+':
        answer = randomNum1 + randomNum2;
        break;
      case '-':
        answer = randomNum1 - randomNum2;
        break;
      case '*':
        answer = randomNum1 * randomNum2;
        break;
      default:
        answer = 0;
    }
    setCorrectAnswer(answer);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (parseInt(formData.mathAnswer) !== correctAnswer) {
      setFormError("Le calcul est incorrect. Veuillez réessayer.");
      setLoading(false);
      generateRandomCalculation();
      return;
    }

    // Utilisation de la clé publique d'EmailJS dans l'appel d'EmailJS
    emailjs.sendForm(
      'service_w6baxx9', // ID du service, par exemple Gmail
      'template_zgdtf71', // ID du modèle d'email
      e.target, // Le formulaire
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY // Clé publique récupérée de .env
    )
    .then((result) => {
      console.log('Email envoyé avec succès:', result.text);
      setFormSubmitted(true);
    })
    .catch((error) => {
      console.log('Erreur lors de l\'envoi de l\'email:', error.text);
      setFormError("Une erreur est survenue, veuillez réessayer.");
    })
    .finally(() => {
      setFormData({
        name: '',
        firstname: '',
        email: '',
        phone: '',
        subject: 'Consultation',
        message: '',
        mathAnswer: ''
      });
      setLoading(false);
      generateRandomCalculation();
    });
  };

  return (
    <div className="contact-page">
      <Navbar />
      <section id="contact">
        <div className="contact-container">
          <div className="contact-header">
            <h1>Contactez-Nous</h1>
            <p className="contact-subtitle">
              Des questions sur nos services vétérinaires ? <br />
              Notre équipe est à votre écoute !
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info-card">
              <h2>Informations de Contact</h2>
              <div className="contact-info-item">
                <div className="info-icon email-icon">✉️</div>
                <div>
                  <h3>Email</h3>
                  <p className="information">contact@petscare.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon phone-icon">📞</div>
                <div>
                  <h3>Téléphone</h3>
                  <p className="information">01 23 45 67 89</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon hours-icon">🕒</div>
                <div>
                  <h3>Heures d'ouverture</h3>
                  <p className="information">
                    Lundi - Vendredi : 9h - 19h<br />
                    Samedi : 10h - 16h<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="info-icon address-icon">📍</div>
                <div>
                  <h3>Adresse</h3>
                  <p className="information">123 Rue des Animaux, 75000 Paris</p>
                </div>
              </div>
            </div>

            <div className="contact-form-card">
              <h2>Envoyez-nous un message</h2>

              {formSubmitted ? (
                <div className="form-success-message">
                  <div className="success-icon">✓</div>
                  <h3>Merci de nous avoir contacté !</h3>
                  <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
                  <button className="new-message-btn" onClick={() => setFormSubmitted(false)}>
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {formError && <div className="form-error">{formError}</div>}

                  <div className="form-row">
                    <div className="form-groupe">
                      <label htmlFor="name">Nom*</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Dupont"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-groupe">
                      <label htmlFor="firstname">Prénom</label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        placeholder="Jean"
                        value={formData.firstname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-groupe">
                      <label htmlFor="email">Email*</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="votre.email@exemple.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-groupe">
                      <label htmlFor="phone">Téléphone*</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="01 23 45 67 89"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-groupe">
                    <label htmlFor="subject">Sujet</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Urgence">Urgence</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-groupe">
                    <label htmlFor="message">Message*</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Veuillez saisir votre message ici..."
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="form-groupe captcha-group">
                    <label htmlFor="mathAnswer">Vérification: Calculez {num1} {operator} {num2}*</label>
                    <input
                      id="mathAnswer"
                      name="mathAnswer"
                      type="number"
                      required
                      placeholder="Entrez votre réponse"
                      value={formData.mathAnswer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-footer">
                    <p className="required-fields">* Champs obligatoires</p>
                    <button
                      className="submit-btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;