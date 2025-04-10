import React, { useState } from 'react';
import { deletePet } from '../../services/petService';
import PetUpdateForm from './PetUpdateForm';

const PetsList = ({ pets, onPetDeleted, onPetUpdated }) => {
  const [selectedPetForUpdate, setSelectedPetForUpdate] = useState(null);
  const [selectedPetForVaccination, setSelectedPetForVaccination] = useState(null);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);

  const handleDeletePet = async (petId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.');
    
    if (confirmDelete) {
      try {
        await deletePet(petId);
        
        // Appeler le callback pour mettre à jour la liste des animaux
        if (onPetDeleted) {
          onPetDeleted(petId);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'animal', error);
        alert('Impossible de supprimer l\'animal. Veuillez réessayer.');
      }
    }
  };

  const handleUpdatePet = (updatedPet) => {
    if (onPetUpdated) {
      onPetUpdated(updatedPet);
    }
    setSelectedPetForUpdate(null);
  };

  const handleVaccinationAdded = () => {
    // Fermer le formulaire après l'ajout
    setShowVaccinationForm(false);
    
    // Déclencher une mise à jour si nécessaire
    if (onPetUpdated) {
      onPetUpdated();
    }
  };

  // Fonction pour calculer l'âge en années ou mois
  const formatAge = (age) => {
    if (age === null) return 'Non renseigné';
    
    if (age < 1) {
      return `${Math.round(age * 12)} mois`;
    }
    
    return `${Math.round(age)} ans`;
  };

  return (
    <div className="pets-list-container">
      {pets.map(pet => (
        <div key={pet.id} className="pet-card">
          {selectedPetForUpdate === pet.id ? (
            <PetUpdateForm 
              petId={pet.id} 
              onPetUpdated={handleUpdatePet}
              onCancel={() => setSelectedPetForUpdate(null)}
            />
          ) : selectedPetForVaccination === pet.id && showVaccinationForm ? (
            <VaccinationForm
              petId={pet.id}
              onVaccinationAdded={handleVaccinationAdded}
              onCancel={() => {
                setSelectedPetForVaccination(null);
                setShowVaccinationForm(false);
              }}
            />
          ) : (
            <>
              <div className="pet-details">
                <h3>{pet.name}</h3>
                <p>Type : {pet.type}</p>
                {pet.breed && <p>Race : {pet.breed}</p>}
                <p>Âge : {formatAge(pet.age)}</p>
                {pet.gender && <p>Genre : {pet.gender}</p>}
                {pet.weight && <p>Poids : {pet.weight} kg</p>}
                {pet.lastVaccination && (
                  <p>Dernière vaccination : {new Date(pet.lastVaccination).toLocaleDateString()}</p>
                )}
              </div>

              {/* Section vaccinations uniquement si l'animal est sélectionné */}
              {selectedPetForVaccination === pet.id && !showVaccinationForm && (
                <div className="pet-vaccinations-section">
                  <VaccinationList 
                    petId={pet.id} 
                    onVaccinationDeleted={() => {
                      if (onPetUpdated) onPetUpdated();
                    }}
                  />
                  <button 
                    onClick={() => setShowVaccinationForm(true)}
                    className="add-vaccination-btn"
                  >
                    <i className="fas fa-plus"></i> Ajouter une vaccination
                  </button>
                </div>
              )}

              <div className="pet-actions">
                <PassportButton petId={pet.id} />

                <button 
                  onClick={() => {
                    if (selectedPetForVaccination === pet.id) {
                      setSelectedPetForVaccination(null);
                    } else {
                      setSelectedPetForVaccination(pet.id);
                      setShowVaccinationForm(false);
                    }
                  }}
                  className="vaccination-btn"
                >
                  {selectedPetForVaccination === pet.id ? "Masquer vaccins" : "Voir vaccins"}
                </button>

                <button 
                  onClick={() => setSelectedPetForUpdate(pet.id)}
                  className="update-btn"
                >
                  Modifier
                </button>
                
                <button 
                  onClick={() => handleDeletePet(pet.id)}
                  className="delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
