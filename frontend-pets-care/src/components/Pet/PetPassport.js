import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { getPetPassport } from '../../services/vaccinationService';
import '../../styles/PetPassport.css';

const PetPassport = ({ petId, onClose }) => {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const passportRef = useRef();

  useEffect(() => {
    fetchPassport();
  }, [petId]);

  const fetchPassport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getPetPassport(petId);
      setPassport(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur de récupération du passeport :', err);
      setError('Impossible de récupérer le passeport de l\'animal');
      setLoading(false);
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

  // Fonction pour calculer l'âge
  const formatAge = (age) => {
    if (age === null || age === undefined) return 'Non renseigné';
    
    if (age < 1) {
      const months = Math.round(age * 12);
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    
    if (months === 0) {
      return years === 1 ? '1 an' : `${years} ans`;
    }
    
    return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
  };

  // Fonction d'impression
  const handlePrint = useReactToPrint({
    content: () => passportRef.current,
    documentTitle: `Passeport_${passport?.pet?.name || 'Animal'}`,
  });

  if (loading) {
    return <div className="passport-loading">Chargement du passeport...</div>;
  }

  if (error) {
    return <div className="passport-error">{error}</div>;
  }

  if (!passport) {
    return <div className="passport-error">Passeport non disponible</div>;
  }

  return (
    <div className="passport-container">
      <div className="passport-header">
        <h2>Passeport Santé Animal</h2>
        <div className="passport-actions">
          <button onClick={handlePrint} className="print-btn">
            <i className="fas fa-print"></i> Imprimer
          </button>
          {onClose && (
            <button onClick={onClose} className="close-btn">
              <i className="fas fa-times"></i> Fermer
            </button>
          )}
        </div>
      </div>
      
      <div className="passport-content" ref={passportRef}>
        <div className="passport-title">
          <h1>PASSEPORT SANTÉ</h1>
          <div className="passport-logo">PetsCare</div>
        </div>
        
        <div className="passport-section">
          <h3>Informations de l'animal</h3>
          <div className="passport-details">
            <div className="passport-details-row">
              <div className="detail-label">Nom:</div>
              <div className="detail-value">{passport.pet.name}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Type:</div>
              <div className="detail-value">{passport.pet.type}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Race:</div>
              <div className="detail-value">{passport.pet.breed || 'Non renseigné'}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Âge:</div>
              <div className="detail-value">{formatAge(passport.pet.age)}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Genre:</div>
              <div className="detail-value">{passport.pet.gender || 'Non renseigné'}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Poids:</div>
              <div className="detail-value">{passport.pet.weight ? `${passport.pet.weight} kg` : 'Non renseigné'}</div>
            </div>
            <div className="passport-details-row">
              <div className="detail-label">Enregistré le:</div>
              <div className="detail-value">{formatDate(passport.pet.createdAt)}</div>
            </div>
          </div>
        </div>

        {passport.owner && (
          <div className="passport-section">
            <h3>Propriétaire</h3>
            <div className="passport-details">
              <div className="passport-details-row">
                <div className="detail-label">Nom:</div>
                <div className="detail-value">{passport.owner.firstName} {passport.owner.lastName}</div>
              </div>
              <div className="passport-details-row">
                <div className="detail-label">Email:</div>
                <div className="detail-value">{passport.owner.email}</div>
              </div>
              {passport.owner.phone && (
                <div className="passport-details-row">
                  <div className="detail-label">Téléphone:</div>
                  <div className="detail-value">{passport.owner.phone}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="passport-section">
          <h3>Historique des vaccinations</h3>
          {passport.vaccinations.length === 0 ? (
            <p className="no-vaccinations">Aucune vaccination enregistrée</p>
          ) : (
            <table className="vaccinations-table">
              <thead>
                <tr>
                  <th>Nom du vaccin</th>
                  <th>Date</th>
                  <th>Date d'expiration</th>
                  <th>Vétérinaire</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {passport.vaccinations.map(vaccination => (
                  <tr key={vaccination.id}>
                    <td>{vaccination.vaccineName}</td>
                    <td>{formatDate(vaccination.vaccineDate)}</td>
                    <td>{vaccination.expiryDate ? formatDate(vaccination.expiryDate) : 'Non spécifiée'}</td>
                    <td>{vaccination.veterinarian || 'Non renseigné'}</td>
                    <td>{vaccination.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {passport.pet.medicalNotes && (
          <div className="passport-section">
            <h3>Notes médicales</h3>
            <div className="medical-notes">
              {passport.pet.medicalNotes}
            </div>
          </div>
        )}

        <div className="passport-footer">
          <p>Ce passeport a été généré par PetsCare le {formatDate(new Date().toISOString())}</p>
        </div>
      </div>
    </div>
  );
};

export default PetPassport;