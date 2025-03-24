import React, { useState } from 'react';
import { register } from '../services/authService';
import '../styles/index.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      // Préparer les données pour l'inscription
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password
      };

      // Appeler le service d'inscription
      const response = await register(registrationData);

      // Gérer la réponse réussie
      setSuccess(true);
      setError('');
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

      // Vous pouvez ajouter ici une redirection ou une gestion de connexion automatique
      console.log('Inscription réussie', response);
    } catch (err) {
      // Gérer les erreurs d'inscription
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2 className="register-title">Créer un compte Pets Care</h2>
        <p className="register-subtitle">Commencez à prendre soin de votre animal</p>
        
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}
          {success && <div className="register-success">Compte créé avec succès !</div>}
          
          <div className="register-name-grid">
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              className="register-input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              className="register-input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Téléphone (optionnel)"
            className="register-input"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            className="register-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-submit-btn">
            Créer un compte
          </button>

          <p className="register-subtitle">
            Déjà un compte ? <a href="/login" className="register-login-link">Connectez-vous</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;