// Modèle de template pour EmailJS
// Ce fichier est à titre informatif pour comprendre la structure des données
// envoyées à EmailJS. Ce n'est pas utilisé directement par le code.

const vaccinationReminderTemplate = {
    // Variables disponibles dans votre template EmailJS
    template_params: {
      to_name: "Prénom et Nom du propriétaire",
      to_email: "email@exemple.com",
      pet_name: "Nom de l'animal",
      pet_type: "Type d'animal (chien, chat, etc.)",
      expiration_date: "Date d'expiration du vaccin",
      subject: "Rappel de vaccination pour [pet_name]"
    },
    
    // Corps du message que vous pouvez configurer dans l'interface EmailJS
    /* 
    Bonjour {{to_name}},
  
    Nous espérons que vous et {{pet_name}} allez bien.
  
    Nous vous contactons pour vous rappeler que le vaccin de {{pet_name}} arrive à expiration le {{expiration_date}}.
  
    Pour assurer la santé et le bien-être de votre {{pet_type}}, nous vous recommandons de prendre rendez-vous pour un rappel de vaccination.
  
    Vous pouvez prendre rendez-vous facilement en vous connectant à votre compte PetsCare ou en nous appelant au 01 23 45 67 89.
  
    Cordialement,
    L'équipe PetsCare
    */
  };
  
  module.exports = vaccinationReminderTemplate;