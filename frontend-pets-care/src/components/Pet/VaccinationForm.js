import React, { useState } from 'react';
import { addVaccination } from '../../services/vaccinationService';
import '../../styles/VaccinationForm.css';

const VaccinationForm = ({ petId, onVaccinationAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccineDate: '',
    expiryDate: '',
    veterinarian: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Suggestions pour les noms de vaccins communs selon le type d'animal
  const commonVaccines = {
    Chien: ['Rage', 'Distemper (Carré)', 'Parvovirose', 'Hépatite canine', 'Leptospirose', 'Toux du chenil'],
    Chat: ['Rage', 'Leucémie féline', 'Rhinotrachéite', 'Calicivirose', 'Panleucopénie féline', 'Chlamydiose'],
    Lapin: ['Myxomatose', 'Maladie hémorragique virale (VHD)'],
    // Ajouter d'autres types d'animaux si nécessaire
  };

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
    setSuccess(false);
    setLoading(true);

    if (!formData.vaccineName || !formData.vaccineDate) {
      setError('Veuillez remplir au moins le nom du vaccin et la date de vaccination.');
      setLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'envoi
      const vaccinationData = {
        ...formData,
        petId
      };

      // Envoyer les données
      await addVaccination(vaccinationData);

      // Mise à jour de l'interface
      setSuccess(true);
      setFormData({
        vaccineName: '',
        vaccineDate: '',
        expiryDate: '',
        veterinarian: '',
        notes: ''
      });

      // Appeler le callback si fourni
      if (onVaccinationAdded) {
        onVaccinationAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la vaccination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vaccination-form-container">
      <h3>Ajouter une vaccination</h3>
      
      {error && <div className="vaccination-error">{error}</div>}
      {success && <div className="vaccination-success">Vaccination ajoutée avec succès!</div>}
      
      <form onSubmit={handleSubmit} className="vaccination-form">
        <div className="form-group">
          <label htmlFor="vaccineName">Nom du vaccin*</label>
          <input
            type="text"
            id="vaccineName"
            name="vaccineName"
            value={formData.vaccineName}
            onChange={handleChange}
            required
            list="vaccine-suggestions"
          />
          <datalist id="vaccine-suggestions">
            {commonVaccines.Chien && commonVaccines.Chien.map((vaccine, index) => (
              <option key={`dog-${index}`} value={vaccine} />
            ))}
            {commonVaccines.Chat && commonVaccines.Chat.map((vaccine, index) => (
              <option key={`cat-${index}`} value={vaccine} />
            ))}
            {commonVaccines.Lapin && commonVaccines.Lapin.map((vaccine, index) => (
              <option key={`rabbit-${index}`} value={vaccine} />
            ))}
          </datalist>
        </div>
        
        <div className="form-group">
          <label htmlFor="vaccineDate">Date de vaccination*</label>
          <input
            type="date"
            id="vaccineDate"
            name="vaccineDate"
            value={formData.vaccineDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="expiryDate">Date d'expiration</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            min={formData.vaccineDate}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="veterinarian">Vétérinaire</label>
          <input
            type="text"
            id="veterinarian"
            name="veterinarian"
            value={formData.veterinarian}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Ajouter la vaccination'}
          </button>
          
          {onCancel && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VaccinationForm;