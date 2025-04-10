import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vaccinations';

// Fonction pour ajouter une vaccination
export const addVaccination = async (vaccinationData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/add`, 
      vaccinationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur d\'ajout de vaccination :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer les vaccinations d'un animal
export const getPetVaccinations = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/pet/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des vaccinations :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer le passeport complet d'un animal
export const getPetPassport = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/passport/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération du passeport :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour supprimer une vaccination
export const deleteVaccination = async (vaccinationId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_URL}/${vaccinationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de suppression de vaccination :', error.response?.data || error.message);
    throw error;
  }
};