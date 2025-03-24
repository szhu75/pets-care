import React, { useState, useEffect } from 'react';
import { updatePet, getPetDetails } from '../../services/petService';

const PetUpdateForm = ({ petId, onPetUpdated, onCancel }) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const petDetails = await getPetDetails(petId);
        
        // Convertir l'âge en années ou mois
        const ageInYears = petDetails.age;
        const ageValue = ageInYears !== null 
          ? (ageInYears < 1 
            ? Math.round(ageInYears * 12) 
            : Math.round(ageInYears))
          : '';
        
        const ageUnit = ageInYears !== null && ageInYears < 1 ? 'mois' : 'années';

        setFormData({
          name: petDetails.name,
          type: petDetails.type,
          breed: petDetails.breed || '',
          ageValue: ageValue.toString(),
          ageUnit: ageUnit,
          gender: petDetails.gender || '',
          weight: petDetails.weight ? petDetails.weight.toString() : '',
          lastVaccination: petDetails.lastVaccination || '',
          medicalNotes: petDetails.medicalNotes || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les détails de l\'animal');
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Calculer l'âge en années
      let age = formData.ageValue ? parseFloat(formData.ageValue) : null;
      if (age !== null) {
        age = formData.ageUnit === 'mois' ? age / 12 : age;
      }

      // Préparer les données pour l'envoi
      const petData = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: age,
        gender: formData.gender,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        lastVaccination: formData.lastVaccination,
        medicalNotes: formData.medicalNotes
      };

      // Appeler le service de mise à jour
      const updatedPet = await updatePet(petId, petData);
      
      // Appeler le callback de mise à jour
      if (onPetUpdated) {
        onPetUpdated(updatedPet);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'animal');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="pet-update-container">
      <h2>Modifier l'animal</h2>
      
      <form onSubmit={handleSubmit} className="pet-update-form">
        {error && <div className="error-message">{error}</div>}
        
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

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Mettre à jour
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetUpdateForm;