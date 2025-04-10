import React, { useState, useEffect } from 'react';
import { getPetVaccinations, deleteVaccination } from '../../services/vaccinationService';
import '../../styles/VaccinationList.css';

const VaccinationList = ({ petId, onVaccinationDeleted }) => {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaccinations();
  }, [petId]);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getPetVaccinations(petId);
      setVaccinations(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur de récupération des vaccinations :', err);
      setError('Impossible de récupérer les vaccinations');
      setLoading(false);
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    try {
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette vaccination ?');
      
      if (confirmDelete) {
        await deleteVaccination(vaccinationId);
        
        // Mettre à jour la liste
        fetchVaccinations();
        
        // Appeler le callback si fourni
        if (onVaccinationDeleted) {
          onVaccinationDeleted();
        }
      }
    } catch (err) {
      console.error('Erreur de suppression de vaccination :', err);
      setError('Erreur lors de la suppression de la vaccination');
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculer le statut d'expiration d'un vaccin
  const getExpirationStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', label: 'Non défini' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', label: 'Expiré' };
    } else if (diffDays < 30) {
      return { status: 'warning', label: 'Expiration proche' };
    } else {
      return { status: 'valid', label: 'Valide' };
    }
  };

  if (loading) {
    return <div className="vaccination-loading">Chargement des vaccinations...</div>;
  }

  if (error) {
    return <div className="vaccination-error">{error}</div>;
  }

  return (
    <div className="vaccination-list-container">
      <h3>Historique des vaccinations</h3>
      
      {vaccinations.length === 0 ? (
        <div className="no-vaccinations">
          <p>Aucune vaccination enregistrée</p>
        </div>
      ) : (
        <div className="vaccination-list">
          {vaccinations.map(vaccination => {
            const expirationStatus = getExpirationStatus(vaccination.expiryDate);
            
            return (
              <div key={vaccination.id} className="vaccination-item">
                <div className="vaccination-details">
                  <h4>{vaccination.vaccineName}</h4>
                  <div className="vaccination-info">
                    <span className="vaccination-date">
                      <i className="fas fa-calendar"></i> {formatDate(vaccination.vaccineDate)}
                    </span>
                    {vaccination.expiryDate && (
                      <span className={`vaccination-expiry ${expirationStatus.status}`}>
                        <i className="fas fa-hourglass-end"></i> {expirationStatus.label} ({formatDate(vaccination.expiryDate)})
                      </span>
                    )}
                    {vaccination.veterinarian && (
                      <span className="vaccination-vet">
                        <i className="fas fa-user-md"></i> {vaccination.veterinarian}
                      </span>
                    )}
                  </div>
                  {vaccination.notes && (
                    <div className="vaccination-notes">
                      <i className="fas fa-sticky-note"></i> {vaccination.notes}
                    </div>
                  )}
                </div>
                <div className="vaccination-actions">
                  <button
                    onClick={() => handleDeleteVaccination(vaccination.id)}
                    className="delete-btn"
                    title="Supprimer cette vaccination"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VaccinationList;