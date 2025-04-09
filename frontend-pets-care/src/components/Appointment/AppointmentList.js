import React, { useState, useEffect } from 'react';
import { getUserAppointments, cancelAppointment } from '../../services/appointmentService';
import '../../styles/Appointments.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getUserAppointments();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      setError('Impossible de charger les rendez-vous');
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      // Mettre à jour la liste des rendez-vous après annulation
      fetchAppointments();
    } catch (err) {
      setError('Impossible d\'annuler le rendez-vous');
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

  // Fonction pour déterminer le statut du rendez-vous
  const getAppointmentStatus = (date) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    
    if (appointmentDate < today) {
      return 'Passé';
    } else if (appointmentDate.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else {
      return 'À venir';
    }
  };

  if (loading) {
    return <div>Chargement des rendez-vous...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="appointments-list-container">
      <h2>Mes Rendez-vous</h2>
      
      {appointments.length === 0 ? (
        <p>Aucun rendez-vous programmé</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.petName}</h3>
                <span 
                  className={`status-badge ${
                    getAppointmentStatus(appointment.date) === 'Passé' ? 'past' : 
                    getAppointmentStatus(appointment.date) === 'Aujourd\'hui' ? 'today' : 'upcoming'
                  }`}
                >
                  {getAppointmentStatus(appointment.date)}
                </span>
              </div>
              
              <div className="appointment-details">
                <p>
                  <strong>Type :</strong> 
                  {appointment.type === 'health_check' ? 'Contrôle de santé' : 
                   appointment.type === 'vaccination' ? 'Vaccination' :
                   appointment.type === 'consultation' ? 'Consultation' :
                   'Urgence'}
                </p>
                <p>
                  <strong>Date :</strong> {formatDate(appointment.date)}
                </p>
                <p>
                  <strong>Heure :</strong> {appointment.time}
                </p>
                {appointment.notes && (
                  <p>
                    <strong>Notes :</strong> {appointment.notes}
                  </p>
                )}
              </div>
              
              {getAppointmentStatus(appointment.date) === 'À venir' && (
                <button 
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="cancel-btn"
                >
                  Annuler le rendez-vous
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;