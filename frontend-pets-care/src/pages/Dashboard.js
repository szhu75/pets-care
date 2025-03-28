import React, { useState, useEffect } from 'react';
import { getUserPets, deletePet } from '../services/petService';
import { getUserAppointments } from '../services/appointmentService';
import PetRegistration from '../components/Pet/PetRegistration';
import PetUpdateForm from '../components/Pet/PetUpdateForm';
import AppointmentForm from '../components/Appointment/AppointmentForm';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import '../styles/index.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPetForUpdate, setSelectedPetForUpdate] = useState(null);

  // Fonction de formatage de l'âge
  const formatAge = (age) => {
    if (age === null || age === undefined) return 'Non renseigné';
    
    if (age < 1) {
      const months = Math.round(age * 12);
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    
    if (years === 0) {
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    
    if (months === 0) {
      return years === 1 ? '1 an' : `${years} ans`;
    }
    
    const yearText = years === 1 ? 'an' : 'ans';
    return `${years} ${yearText} et ${months} mois`;
  };

  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Charger les animaux et rendez-vous
        fetchPets();
        fetchAppointments();
      } catch (error) {
        console.error('Erreur de parsing des données utilisateur', error);
        handleLogout();
      }
    } else {
      // Rediriger vers la page de connexion si pas authentifié
      window.location.href = '/login';
    }
  }, []);

  const fetchPets = async () => {
    try {
      const userPets = await getUserPets();
      setPets(userPets);
    } catch (error) {
      console.error('Erreur de récupération des animaux', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const userAppointments = await getUserAppointments();
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Erreur de récupération des rendez-vous', error);
    }
  };

  const handleLogout = () => {
    // Supprimer les informations de l'utilisateur du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Rediriger vers la page d'accueil
    window.location.href = '/';
  };

  const handlePetAdded = (newPet) => {
    setPets([...pets, newPet]);
    setShowPetForm(false);
  };

  const handlePetUpdate = (updatedPet) => {
    setPets(pets.map(pet => 
      pet.id === updatedPet.id ? updatedPet : pet
    ));
    setSelectedPetForUpdate(null);
  };

  const handlePetDelete = async (petId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.');
    
    if (confirmDelete) {
      try {
        await deletePet(petId);
        setPets(pets.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'animal', error);
        alert('Impossible de supprimer l\'animal. Veuillez réessayer.');
      }
    }
  };

  // Si l'utilisateur n'est pas encore chargé
  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-container">
        {/* Section Profil Utilisateur et Déconnexion */}
        <div className="dashboard-header">
          <div className="user-profile">
            <div className="user-info">
              <h2>Profil de {user.firstName} {user.lastName}</h2>
              <p>Email : {user.email}</p>
              {user.phone && <p>Téléphone : {user.phone}</p>}
            </div>
            <button 
              onClick={handleLogout} 
              className="logout-button"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <h1 className="dashboard-title">Tableau de bord</h1>
       
        <div className="dashboard-grid">
          {/* Section Mes Animaux */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Mes Animaux</h2>
            <button 
              className="dashboard-add-button"
              onClick={() => setShowPetForm(!showPetForm)}
            >
              {showPetForm ? 'Annuler' : 'Ajouter un animal'}
            </button>

            {showPetForm && (
              <PetRegistration onPetAdded={handlePetAdded} />
            )}

            {pets.length === 0 ? (
              <p>Aucun animal enregistré</p>
            ) : (
              <div className="dashboard-pets-list">
                {pets.map(pet => (
                  <div key={pet.id} className="dashboard-pet-item">
                    {selectedPetForUpdate === pet.id ? (
                      <PetUpdateForm 
                        petId={pet.id}
                        onPetUpdated={handlePetUpdate}
                        onCancel={() => setSelectedPetForUpdate(null)}
                      />
                    ) : (
                      <>
                        <div className="dashboard-pet-details">
                          <span className="dashboard-pet-name">{pet.name}</span>
                          <span>{pet.type} - {pet.breed}</span>
                          <span>Âge : {formatAge(pet.age)}</span>
                          <span>Dernier vaccin : {pet.lastVaccination || 'Non renseigné'}</span>
                        </div>
                        <div className="dashboard-pet-actions">
                          <button 
                            onClick={() => setSelectedPetForUpdate(pet.id)}
                            className="dashboard-modify-button"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handlePetDelete(pet.id)}
                            className="dashboard-delete-button"
                          >
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Rendez-vous */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Mes Rendez-vous</h2>
            <button 
              className="dashboard-add-button"
              onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            >
              {showAppointmentForm ? 'Annuler' : 'Nouveau rendez-vous'}
            </button>

            {showAppointmentForm && (
              <AppointmentForm 
                onClose={() => {
                  setShowAppointmentForm(false);
                  fetchAppointments(); // Recharger les rendez-vous après ajout
                }} 
              />
            )}

            {appointments.length === 0 ? (
              <p>Aucun rendez-vous</p>
            ) : (
              <div className="dashboard-appointments-list">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="dashboard-appointment-item">
                    <div className="dashboard-appointment-details">
                      <span className="dashboard-appointment-pet-name">{appointment.petName}</span>
                      <span>{appointment.type}</span>
                    </div>
                    <div>
                      <span>{appointment.date} à {appointment.time}</span>
                      <span className={`
                        inline-block ml-2 px-2 py-1 rounded-full text-xs
                        ${appointment.status === 'À venir' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Rappels */}
        <div className="dashboard-reminders">
          <h2 className="dashboard-section-title">Rappels</h2>
          <div className="dashboard-reminders-grid">
            <div className="dashboard-reminder-item dashboard-reminder-vaccine">
              <h3>Vaccin de Buddy</h3>
              <p>À faire avant le 15/09/2024</p>
            </div>
            <div className="dashboard-reminder-item dashboard-reminder-checkup">
              <h3>Contrôle annuel</h3>
              <p>Whiskers - À programmer</p>
            </div>
            <div className="dashboard-reminder-item dashboard-reminder-available">
              <h3>Bon pour une visite</h3>
              <p>Prochain rendez-vous disponible</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;