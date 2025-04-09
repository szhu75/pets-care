import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  try {
    console.log('Tentative de connexion avec :', { email, password });
    const response = await axios.post(`${API_URL}/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Réponse du serveur :', response.data);
    return response.data;
  } catch (error) {
    console.error('Détails de l\'erreur :', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Tentative d\'inscription avec :', userData);
    const response = await axios.post(`${API_URL}/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Réponse du serveur :', response.data);
    return response.data;
  } catch (error) {
    console.error('Détails de l\'erreur :', error.response?.data || error.message);
    throw error;
  }
};

// Nouvelle méthode pour vérifier si l'utilisateur est un admin
export const isAdminUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const adminEmails = ['test@example.com']; // Vous pouvez ajouter d'autres emails admin si nécessaire
  return user && adminEmails.includes(user.email);
};

// Méthode pour obtenir le rôle de l'utilisateur
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return null;
  
  if (isAdminUser()) {
    return 'admin';
  }
  return 'user';
};