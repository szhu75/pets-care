import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reminders';

// Fonction pour récupérer les animaux nécessitant un rappel de vaccination
export const getPetsNeedingVaccineReminders = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/vaccination-needed`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des rappels de vaccination :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour envoyer un rappel de vaccination
export const sendVaccinationReminder = async (petId, reminderType = 'email') => {
  try {
    const token = localStorage.getItem('token');
    
    console.log(`Envoi d'un rappel pour l'animal ID: ${petId} via ${reminderType}`);
    
    const response = await axios.post(
      `${API_URL}/send`, 
      { petId, reminderType },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Réponse du serveur après envoi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur d\'envoi de rappel :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer l'historique des rappels
export const getReminderHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération de l\'historique des rappels :', error.response?.data || error.message);
    throw error;
  }
};