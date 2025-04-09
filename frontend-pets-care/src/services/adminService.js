import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Fonction pour récupérer les statistiques globales
export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des statistiques :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des utilisateurs :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer tous les rendez-vous
export const getAllAppointments = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des rendez-vous :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer tous les animaux
export const getAllPets = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/pets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des animaux :', error.response?.data || error.message);
    throw error;
  }
};