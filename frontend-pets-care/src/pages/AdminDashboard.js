import React, { useState, useEffect } from 'react';
import { getUserAppointments } from '../services/appointmentService';
import { getUserPets } from '../services/petService';

// Importation des composants Navbar et Footer
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalPets: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const fetchedAppointments = await getUserAppointments();
      const fetchedPets = await getUserPets();

      setAppointments(fetchedAppointments);
      setPets(fetchedPets);

      // Calculer les statistiques
      setStats({
        totalAppointments: fetchedAppointments.length,
        pendingAppointments: fetchedAppointments.filter((app) => app.status === 'En cours').length,
        totalPets: fetchedPets.length,
      });
    } catch (error) {
      console.error('Erreur de récupération des données', error);
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      console.log(`${action} rendez-vous ${appointmentId}`);
      fetchAdminData(); // Rafraîchir les données après l'action
    } catch (error) {
      console.error(`Erreur lors de l'action sur le rendez-vous`, error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Barre de navigation */}
      <Navbar />

      {/* Contenu principal */}
      <div className="admin-dashboard-header">
        <h1>Tableau de Bord Administrateur</h1>
      </div>

      <div className="admin-dashboard-stats">
        <div className="stat-card">
          <h3>Rendez-vous Totaux</h3>
          <p>{stats.totalAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>Rendez-vous en Attente</h3>
          <p>{stats.pendingAppointments}</p>
        </div>
        <div className="stat-card">
          <h3>Animaux Enregistrés</h3>
          <p>{stats.totalPets}</p>
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
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.petName}</td>
                    <td>{appointment.type}</td>
                    <td>{appointment.date} à {appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <div className="appointment-actions">
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'Confirmer')}
                          className="confirm-btn"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'Annuler')}
                          className="cancel-btn"
                        >
                          Annuler
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-pets-section">
          <h2>Animaux Récemment Ajoutés</h2>
          {pets.length === 0 ? (
            <p>Aucun animal enregistré</p>
          ) : (
            <table className="admin-pets-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Âge</th>
                  <th>Dernier Vaccin</th>
                </tr>
              </thead>
              <tbody>
                {pets.slice(0, 5).map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.type}</td>
                    <td>{pet.age ? `${Math.round(pet.age)} ans` : 'Non renseigné'}</td>
                    <td>{pet.lastVaccination || 'Non renseigné'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Section de rappels */}
      <div className="admin-dashboard-actions">
        <div className="reminder-section">
          <h2>Rappels et Alertes</h2>
          <div className="reminder-list">
            <div className="reminder-item">
              <span>Vaccins à jour</span>
              <button className="send-reminder-btn">Envoyer Rappels</button>
            </div>
            <div className="reminder-item">
              <span>Contrôles de santé</span>
              <button className="send-reminder-btn">Envoyer Rappels</button>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
