import React, { useState, useEffect } from 'react';
import { createAppointment } from '../../services/appointmentService';
import { getUserPets } from '../../services/petService';
import '../../styles/Appointments.css';

const AppointmentForm = ({ onClose }) => {
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    petId: '',
    petName: '',
    appointmentType: '',
    date: '',
    time: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Types de rendez-vous en français
  const appointmentTypes = {
    'health_check': 'Contrôle de santé',
    'vaccination': 'Vaccination',
    'consultation': 'Consultation',
    'emergency': 'Urgence'
  };

  // Récupérer les animaux de l'utilisateur
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const userPets = await getUserPets();
        setPets(userPets);
      } catch (err) {
        console.error('Erreur de chargement des animaux', err);
        setError('Impossible de charger vos animaux');
      }
    };

    fetchPets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      // Gestion spéciale pour la sélection de l'animal
      if (name === 'petName') {
        const selectedPet = pets.find(pet => pet.name === value);
        return {
          ...prevState,
          [name]: value,
          petId: selectedPet ? selectedPet.id : '',
        };
      }
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  const validateForm = () => {
    if (!formData.petId || !formData.appointmentType || !formData.date || !formData.time) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    if (selectedDate < today) {
      setError('Veuillez choisir une date future');
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
      // Préparer les données pour l'envoi
      const appointmentData = {
        petId: formData.petId,
        type: Object.keys(appointmentTypes).find(
          key => appointmentTypes[key] === formData.appointmentType
        ),
        date: formData.date,
        time: formData.time,
        notes: formData.notes
      };

      // Appeler le service de création de rendez-vous
      await createAppointment(appointmentData);
      
      setSuccess(true);
      setFormData({
        petId: '',
        petName: '',
        appointmentType: '',
        date: '',
        time: '',
        notes: ''
      });

      // Fermer le formulaire après un court délai si un callback est fourni
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <div className="appointment-form-container">
      <h2>Réserver un rendez-vous</h2>
      
      <form onSubmit={handleSubmit} className="appointment-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Rendez-vous réservé avec succès !</div>}
        
        <div className="form-group">
          <label>Animal</label>
          <select
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez votre animal</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.name}>
                {pet.name} ({pet.type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type de rendez-vous</label>
          <select
            name="appointmentType"
            value={formData.appointmentType}
            onChange={handleChange}
            required
          >
            <option value="">Choisissez un type de rendez-vous</option>
            {Object.values(appointmentTypes).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Heure</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Notes supplémentaires</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informations complémentaires (optionnel)"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Réserver le rendez-vous
          </button>
          {onClose && (
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;