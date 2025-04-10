import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

// Mappeurs pour les types de rendez-vous
const typeMapping = {
  'health_check': 'Contrôle de santé',
  'vaccination': 'Vaccination',
  'consultation': 'Consultation',
  'emergency': 'Urgence'
};

const statusMapping = {
  'pending': 'En cours',
  'confirmed': 'Confirmé',
  'completed': 'Terminé',
  'cancelled': 'Annulé'
};

// Fonction pour créer un rendez-vous
export const createAppointment = async (appointmentData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Utiliser directement appointmentData sans faire de mapping supplémentaire
    const convertedData = { ...appointmentData };  

    const response = await axios.post(`${API_URL}/create`, 
      convertedData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur de création de rendez-vous :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer les rendez-vous de l'utilisateur
export const getUserAppointments = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Traduire les types de rendez-vous
    const translatedAppointments = response.data.map(appointment => ({
      ...appointment,
      type: typeMapping[appointment.type] || appointment.type,
      status: statusMapping[appointment.status] || appointment.status
    }));
    
    return translatedAppointments;
  } catch (error) {
    console.error('Erreur de récupération des rendez-vous :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour annuler un rendez-vous
export const cancelAppointment = async (appointmentId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_URL}/${appointmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur d\'annulation du rendez-vous :', error.response?.data || error.message);
    throw error;
  }
};
