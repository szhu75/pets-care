import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pets';

// Fonction pour créer un animal
export const createPet = async (petData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/create`, 
      petData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.pet;
  } catch (error) {
    console.error('Erreur de création d\'animal :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour récupérer les animaux de l'utilisateur
export const getUserPets = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/user`, {
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

// Fonction pour récupérer les détails d'un animal
export const getPetDetails = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de récupération des détails de l\'animal :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour mettre à jour un animal
export const updatePet = async (petId, petData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(`${API_URL}/${petId}`, 
      petData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data.pet;
  } catch (error) {
    console.error('Erreur de mise à jour de l\'animal :', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour supprimer un animal
export const deletePet = async (petId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_URL}/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur de suppression de l\'animal :', error.response?.data || error.message);
    throw error;
  }
};