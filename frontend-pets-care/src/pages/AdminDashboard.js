import React, { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getAllAppointments, 
  getAllPets
} from '../services/adminService';
import { getPetsNeedingVaccineReminders } from '../services/reminderService';

// Importation des composants
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import VaccinationReminders from '../components/Admin/VaccinationReminders';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPets: 0,
    totalUsers: 0,
    petsNeedingVaccination: 0  // Nouvelle statistique
  });
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, appointments, pets, reminders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les statistiques
      const statsData = await getAdminStats();
      
      // Récupérer tous les rendez-vous
      const fetchedAppointments = await getAllAppointments();
      
      // Récupérer tous les animaux
      const fetchedPets = await getAllPets();

      // Récupérer les animaux nécessitant un rappel de vaccination
      const petsNeedingVaccination = await getPetsNeedingVaccineReminders();
      
      // Mettre à jour l'état
      setAppointments(fetchedAppointments);
      setPets(fetchedPets);
      
      // Calculer les statistiques
      setStats({
        totalAppointments: fetchedAppointments.length,
        pendingAppointments: fetchedAppointments.filter((app) => app.status === 'En cours').length,
        totalPets: fetchedPets.length,
        totalUsers: statsData.totalUsers || 0,
        petsNeedingVaccination: petsNeedingVaccination.length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur de récupération des données', error);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
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

  // Fonction pour calculer l'âge en années ou mois
  const formatAge = (age) => {
    if (age === null || age === undefined) return 'Non renseigné';
    
    if (age < 1) {
      // Si l'âge est très petit mais pas nul, afficher au moins "1 mois"
      const months = Math.max(1, Math.round(age * 12));
      return months === 1 ? '1 mois' : `${months} mois`;
    }
    
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    
    if (months === 0) {
      return years === 1 ? '1 an' : `${years} ans`;
    }
    
    return `${years} ans et ${months} mois`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <Navbar />
        <div className="admin-loading">
          <h2>Chargement des données...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <Navbar />
        <div className="admin-error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={fetchAdminData} className="retry-btn">
            Réessayer
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Barre de navigation */}
      <Navbar />

      {/* Contenu principal */}
      <div className="admin-dashboard-header">
        <h1>Tableau de Bord Administrateur</h1>
      </div>

      {/* Onglets de navigation */}
      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active-tab' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Tableau de bord
        </button>
        <button
          className={activeTab === 'appointments' ? 'active-tab' : ''}
          onClick={() => setActiveTab('appointments')}
        >
          Rendez-vous
        </button>
        <button
          className={activeTab === 'pets' ? 'active-tab' : ''}
          onClick={() => setActiveTab('pets')}
        >
          Animaux
        </button>
        <button
          className={activeTab === 'reminders' ? 'active-tab' : ''}
          onClick={() => setActiveTab('reminders')}
        >
          Rappels vaccins
        </button>
      </div>

      {/* Tableau de bord principal */}
      {activeTab === 'dashboard' && (
        <>
          <div className="admin-dashboard-stats">
            <div className="stat-card">
              <h3>Rendez-vous Totaux</h3>
              <p>{stats.totalAppointments}</p>
            </div>
            <div className="stat-card">
              <h3>Animaux Enregistrés</h3>
              <p>{stats.totalPets}</p>
            </div>
            <div className="stat-card">
              <h3>Rappels de vaccination</h3>
              <p className={stats.petsNeedingVaccination > 0 ? 'text-orange-500' : ''}>{stats.petsNeedingVaccination}</p>
            </div>
          </div>

          <div className="admin-dashboard-grid">
            <div className="admin-appointments-section">
              <h2>Rendez-vous Récents</h2>
              {appointments.length === 0 ? (
                <p>Aucun rendez-vous</p>
              ) : (
                <table className="admin-appointments-table">
                  <thead>
                    <tr>
                      <th>Animal</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.Pet?.name || appointment.petName}</td>
                        <td>{appointment.type}</td>
                        <td>{formatDate(appointment.date)} à {appointment.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="admin-pets-section">
              <h2>Animaux nécessitant un rappel de vaccination</h2>
              {stats.petsNeedingVaccination === 0 ? (
                <p>Aucun animal n'a besoin d'un rappel de vaccination pour le moment.</p>
              ) : (
                <div className="vaccination-reminder-preview">
                  <p className="text-orange-500 font-medium">
                    {stats.petsNeedingVaccination} animal(s) nécessitent un rappel de vaccination
                  </p>
                  <button 
                    onClick={() => setActiveTab('reminders')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
                  >
                    Voir et envoyer les rappels
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Section de tous les rendez-vous */}
      {activeTab === 'appointments' && (
        <div className="admin-full-section">
          <h2>Tous les Rendez-vous</h2>
          <div className="admin-search-filter">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="admin-search-input" 
            />
            <select className="admin-filter-select">
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Confirmé">Confirmés</option>
              <option value="Terminé">Terminés</option>
              <option value="Annulé">Annulés</option>
            </select>
          </div>
          {appointments.length === 0 ? (
            <p>Aucun rendez-vous</p>
          ) : (
            <table className="admin-appointments-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Propriétaire</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.Pet?.name || appointment.petName}</td>
                    <td>{appointment.User?.firstName || 'N/A'} {appointment.User?.lastName || ''}</td>
                    <td>{appointment.type}</td>
                    <td>{formatDate(appointment.date)} à {appointment.time}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Section de tous les animaux */}
      {activeTab === 'pets' && (
        <div className="admin-full-section">
          <h2>Tous les Animaux</h2>
          <div className="admin-search-filter">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="admin-search-input" 
            />
            <select className="admin-filter-select">
              <option value="all">Tous les types</option>
              <option value="Chien">Chiens</option>
              <option value="Chat">Chats</option>
              <option value="Oiseau">Oiseaux</option>
              <option value="Lapin">Lapins</option>
              <option value="Autre">Autres</option>
            </select>
          </div>
          {pets.length === 0 ? (
            <p>Aucun animal enregistré</p>
          ) : (
            <table className="admin-pets-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Race</th>
                  <th>Propriétaire</th>
                  <th>Âge</th>
                  <th>Genre</th>
                  <th>Poids</th>
                  <th>Dernier Vaccin</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.type}</td>
                    <td>{pet.breed || 'Non renseigné'}</td>
                    <td>{pet.User?.firstName || 'N/A'} {pet.User?.lastName || ''}</td>
                    <td>{formatAge(pet.age)}</td>
                    <td>{pet.gender || 'Non renseigné'}</td>
                    <td>{pet.weight ? `${pet.weight} kg` : 'Non renseigné'}</td>
                    <td>{pet.lastVaccination ? formatDate(pet.lastVaccination) : 'Non renseigné'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {/* Section des rappels de vaccination */}
      {activeTab === 'reminders' && (
        <div className="admin-full-section">
          <h2>Gestion des Rappels de Vaccination</h2>
          <VaccinationReminders />
        </div>
      )}

      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;