// testEmail.js
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

const emailjs = require('@emailjs/browser');

async function testEmailJS() {
  try {
    emailjs.init('crTVa-NPrJOAzLUtq'); // Votre clé publique

    const result = await emailjs.send(
      'service_petscare', 
      'template_o0k79xp',
      {
        to_name: 'Destinataire Test',
        to_email: 'sophiezhu.pro@gmail.com',
        pet_name: 'Max',
        pet_type: 'Chat',
        expiration_date: '1 juin 2025',
        email: 'contact@petscare.com'
      }
    );
    
    console.log('Résultat du test:', result);
  } catch (error) {
    console.error('Erreur du test:', error);
  }
}

testEmailJS();