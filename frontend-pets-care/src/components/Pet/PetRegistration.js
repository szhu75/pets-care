import React, { useState } from 'react';
import { createPet } from '../../services/petService';

const PetRegistration = ({ onPetAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    ageValue: '',
    ageUnit: 'années',
    gender: '',
    weight: '',
    lastVaccination: '',
    medicalNotes: ''
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
    if (!formData.name || !formData.type) {
      setError('Le nom et le type de l\'animal sont obligatoires');
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
      // Récupérer l'ID de l'utilisateur depuis le localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Calculer l'âge en mois ou en années
      let age = formData.ageValue ? parseInt(formData.ageValue) : null;
      if (age !== null) {
        age = formData.ageUnit === 'mois' ? age / 12 : age;
      }
      
      // Préparer les données pour l'envoi
      const petData = {
        ...formData,
        userId: user.id,
        age: age,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };

      // Supprimer les propriétés non standard avant l'envoi
      delete petData.ageValue;
      delete petData.ageUnit;

      // Appeler le service de création d'animal
      const response = await createPet(petData);
      
      setSuccess(true);
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        type: '',
        breed: '',
        ageValue: '',
        ageUnit: 'années',
        gender: '',
        weight: '',
        lastVaccination: '',
        medicalNotes: ''
      });

      // Appeler la fonction de callback pour mettre à jour la liste des animaux
      if (onPetAdded) {
        onPetAdded(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de l\'animal');
    }
  };

  return (
    <div className="pet-registration-container">
      <h2>Ajouter un Animal</h2>
      
      <form onSubmit={handleSubmit} className="pet-registration-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Animal ajouté avec succès !</div>}
        
        <div className="form-group">
          <label>Nom de l'animal *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type d'animal *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="Chien">Chien</option>
            <option value="Chat">Chat</option>
            <option value="Oiseau">Oiseau</option>
            <option value="Lapin">Lapin</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label>Race</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>

        <div className="form-group age-group">
          <label>Âge</label>
          <div className="age-input-container">
            <input
              type="number"
              name="ageValue"
              value={formData.ageValue}
              onChange={handleChange}
              min="0"
              placeholder="Entrez l'âge"
            />
            <select
              name="ageUnit"
              value={formData.ageUnit}
              onChange={handleChange}
            >
              <option value="années">Années</option>
              <option value="mois">Mois</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Genre</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Sélectionnez</option>
            <option value="Mâle">Mâle</option>
            <option value="Femelle">Femelle</option>
          </select>
        </div>

        <div className="form-group">
          <label>Poids (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.1"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Dernière vaccination</label>
          <input
            type="date"
            name="lastVaccination"
            value={formData.lastVaccination}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Notes médicales</label>
          <textarea
            name="medicalNotes"
            value={formData.medicalNotes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Ajouter l'animal
        </button>
      </form>
    </div>
  );
};

export default PetRegistration;