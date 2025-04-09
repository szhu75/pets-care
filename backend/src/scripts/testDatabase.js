const sequelize = require('../config/database');
const User = require('../models/User');

async function testDatabaseConnection() {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');

    // Vérifier la synchronisation des modèles
    await sequelize.sync();
    console.log('Modèles synchronisés');

    // Tester la recherche d'utilisateurs
    const users = await User.findAll();
    console.log('Utilisateurs trouvés :', users.length);

    // Afficher les détails des utilisateurs
    users.forEach(user => {
      console.log('Utilisateur :', {
        id: user.id,
        email: user.email,
        firstName: user.firstName
      });
    });

    // Tenter de trouver un utilisateur spécifique
    const testUser = await User.findOne({ 
      where: { email: 'test@example.com' } 
    });

    if (testUser) {
      console.log('Utilisateur de test trouvé :', testUser.email);
    } else {
      console.log('Aucun utilisateur trouvé avec cet email');
    }
  } catch (error) {
    console.error('Erreur de diagnostic :', error);
  }
}

testDatabaseConnection();