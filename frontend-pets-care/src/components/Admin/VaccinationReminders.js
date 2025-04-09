import React, { useState, useEffect } from 'react';
import { 
  getPetsNeedingVaccineReminders, 
  sendVaccinationReminder,
  getReminderHistory
} from '../../services/reminderService';

const VaccinationReminders = () => {
  const [petsNeedingReminder, setPetsNeedingReminder] = useState([]);
  const [reminderHistory, setReminderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('needed'); // 'needed' ou 'history'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'needed') {
        const petsData = await getPetsNeedingVaccineReminders();
        setPetsNeedingReminder(petsData);
      } else {
        const historyData = await getReminderHistory();
        setReminderHistory(historyData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur de récupération des données:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleSendReminder = async (petId) => {
    try {
      setSuccessMessage('');
      setError(null);
      
      await sendVaccinationReminder(petId, 'email');
      
      setSuccessMessage('Rappel envoyé avec succès!');
      
      // Rafraîchir les données
      fetchData();
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du rappel');
    }
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calcul du temps écoulé depuis la dernière vaccination
  const getVaccinationInfo = (vaccinationDate) => {
    const lastVaccination = new Date(vaccinationDate);
    const today = new Date();
    
    // Calcul de la différence en mois
    const monthsDiff = (today.getFullYear() - lastVaccination.getFullYear()) * 12 + 
                      today.getMonth() - lastVaccination.getMonth();
    
    // Date d'expiration (1 an après la dernière vaccination)
    const expirationDate = new Date(lastVaccination);
    expirationDate.setFullYear(lastVaccination.getFullYear() + 1);
    
    // Jours restants avant expiration
    const daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));
    
    let status, statusClass;
    
    if (daysUntilExpiration < 0) {
      status = 'Expiré';
      statusClass = 'bg-red-100 text-red-800';
    } else if (daysUntilExpiration <= 30) {
      status = 'Urgence';
      statusClass = 'bg-red-100 text-red-800';
    } else if (daysUntilExpiration <= 60) {
      status = 'Bientôt';
      statusClass = 'bg-yellow-100 text-yellow-800';
    } else {
      status = 'À venir';
      statusClass = 'bg-green-100 text-green-800';
    }
    
    return {
      monthsSince: monthsDiff,
      daysUntilExpiration,
      expirationDate: formatDate(expirationDate),
      status,
      statusClass
    };
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement des rappels de vaccination...</div>;
  }

  return (
    <div className="vaccination-reminders">
      {/* Onglets de navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'needed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('needed')}
        >
          Rappels à envoyer
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Historique
        </button>
      </div>

      {/* Messages de statut */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Contenu des onglets */}
      {activeTab === 'needed' ? (
        <>
          <h3 className="text-lg font-semibold mb-3">Animaux nécessitant un rappel de vaccination</h3>
          
          {petsNeedingReminder.length === 0 ? (
            <p className="text-gray-500">Aucun animal n'a besoin d'un rappel de vaccination pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Animal</th>
                    <th className="py-2 px-4 text-left">Propriétaire</th>
                    <th className="py-2 px-4 text-left">Contact</th>
                    <th className="py-2 px-4 text-left">Dernière vaccination</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                    <th className="py-2 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {petsNeedingReminder.map(pet => {
                    const vaccineInfo = getVaccinationInfo(pet.lastVaccination);
                    
                    return (
                      <tr key={pet.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <strong>{pet.name}</strong>
                          <div className="text-sm text-gray-500">{pet.type}</div>
                        </td>
                        <td className="py-3 px-4">
                          {pet.User.firstName} {pet.User.lastName}
                        </td>
                        <td className="py-3 px-4">
                          <div>{pet.User.email}</div>
                          {pet.User.phone && <div className="text-sm">{pet.User.phone}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div>{formatDate(pet.lastVaccination)}</div>
                          <div className="text-sm text-gray-500">
                            (il y a {vaccineInfo.monthsSince} mois)
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${vaccineInfo.statusClass}`}>
                            {vaccineInfo.status}
                          </span>
                          <div className="text-sm mt-1">
                            Expire le: {vaccineInfo.expirationDate}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleSendReminder(pet.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Envoyer rappel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-3">Historique des rappels</h3>
          
          {reminderHistory.length === 0 ? (
            <p className="text-gray-500">Aucun rappel n'a été envoyé pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Date d'envoi</th>
                    <th className="py-2 px-4 text-left">Animal</th>
                    <th className="py-2 px-4 text-left">Propriétaire</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Méthode</th>
                    <th className="py-2 px-4 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reminderHistory.map(reminder => (
                    <tr key={reminder.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {formatDate(reminder.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <strong>{reminder.Pet.name}</strong>
                        <div className="text-sm text-gray-500">{reminder.Pet.type}</div>
                      </td>
                      <td className="py-3 px-4">
                        {reminder.User.firstName} {reminder.User.lastName}
                      </td>
                      <td className="py-3 px-4">
                        {reminder.type === 'vaccination' ? 'Vaccination' : 
                         reminder.type === 'checkup' ? 'Contrôle' : 'Autre'}
                      </td>
                      <td className="py-3 px-4">
                        {reminder.reminderMethod === 'email' ? 'Email' : 
                         reminder.reminderMethod === 'sms' ? 'SMS' : 'Email + SMS'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reminder.status === 'envoyé' ? 'bg-blue-100 text-blue-800' :
                          reminder.status === 'lu' ? 'bg-green-100 text-green-800' :
                          reminder.status === 'rév_pris' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reminder.status}
                        </span>
                        {reminder.readAt && (
                          <div className="text-sm mt-1">
                            Lu le: {formatDate(reminder.readAt)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaccinationReminders;