import React, { useEffect, useState } from 'react';
import { getUserPets } from '../../services/petService';

const VaccinationRemindersSection = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const userPets = await getUserPets();
        setPets(userPets);
        setLoading(false);
      } catch (err) {
        console.error('Erreur de chargement des animaux', err);
        setError('Impossible de charger vos animaux');
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Filtrer les animaux qui ont besoin d'un rappel de vaccination
  const getPetsNeedingVaccination = () => {
    const today = new Date();
    
    return pets.filter(pet => {
      // Si pas de date de vaccination, on ne peut pas calculer
      if (!pet.lastVaccination) return false;
      
      const lastVaccination = new Date(pet.lastVaccination);
      const nextVaccination = new Date(lastVaccination);
      nextVaccination.setFullYear(lastVaccination.getFullYear() + 1);
      
      // Calcul des jours jusqu'au prochain vaccin
      const daysUntilNextVaccination = Math.floor((nextVaccination - today) / (1000 * 60 * 60 * 24));
      
      // Retourne vrai si le prochain vaccin est dans moins de 60 jours
      return daysUntilNextVaccination <= 60;
    });
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculer des informations sur le vaccin
  const getVaccinationInfo = (vaccinationDate) => {
    const lastVaccination = new Date(vaccinationDate);
    const today = new Date();
    
    // Date du prochain vaccin (1 an après le dernier)
    const nextVaccination = new Date(lastVaccination);
    nextVaccination.setFullYear(lastVaccination.getFullYear() + 1);
    
    // Jours restants jusqu'au prochain vaccin
    const daysRemaining = Math.floor((nextVaccination - today) / (1000 * 60 * 60 * 24));
    
    let urgencyClass = '';
    
    if (daysRemaining <= 0) {
      urgencyClass = 'dashboard-reminder-urgent';
    } else if (daysRemaining <= 30) {
      urgencyClass = 'dashboard-reminder-soon';
    } else {
      urgencyClass = 'dashboard-reminder-upcoming';
    }
    
    return {
      nextVaccinationDate: formatDate(nextVaccination),
      daysRemaining: Math.max(0, daysRemaining),
      urgencyClass
    };
  };

  const petsNeedingVaccination = getPetsNeedingVaccination();

  if (loading) {
    return <div>Chargement des rappels...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (petsNeedingVaccination.length === 0) {
    return (
      <div className="dashboard-reminder-item dashboard-reminder-all-good">
        <h3>Vaccinations à jour</h3>
        <p>Tous vos animaux sont à jour de leurs vaccinations</p>
      </div>
    );
  }

  return (
    <>
      {petsNeedingVaccination.map((pet) => {
        const vaccineInfo = getVaccinationInfo(pet.lastVaccination);
        
        return (
          <div key={pet.id} className={`dashboard-reminder-item ${vaccineInfo.urgencyClass}`}>
            <h3>Vaccin de {pet.name}</h3>
            <p>
              {vaccineInfo.daysRemaining === 0
                ? 'À faire dès maintenant !'
                : `À faire avant le ${vaccineInfo.nextVaccinationDate}`}
            </p>
            {vaccineInfo.daysRemaining > 0 && (
              <div className="reminder-days-count">
                {vaccineInfo.daysRemaining} jour{vaccineInfo.daysRemaining > 1 ? 's' : ''} restant{vaccineInfo.daysRemaining > 1 ? 's' : ''}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default VaccinationRemindersSection;