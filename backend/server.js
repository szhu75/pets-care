const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const { User, Pet } = require('./src/models');

// Créer l'application express
const app = express();

// Configuration CORS la plus large
app.use(cors({
  origin: '*', // Attention : à utiliser UNIQUEMENT en développement
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());

// Importer les routes
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const petRoutes = require('./src/routes/petRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes'); // Nouvelles routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reminders', reminderRoutes); // Ajout des routes de rappel

// Route de test
app.get('/', (req, res) => {
  res.send('Backend Pets Care est en ligne !');
});

// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('Modèles synchronisés');
    
    // Port d'écoute
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Serveur running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion ou de synchronisation :', error);
  });