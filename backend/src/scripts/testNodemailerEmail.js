// src/scripts/testNodemailerEmail.js
const nodemailer = require('nodemailer');

async function testSendEmail() {
  try {
    // Créer un compte de test Ethereal (service de test d'emails)
    const testAccount = await nodemailer.createTestAccount();
    console.log('Compte de test créé:', testAccount.user);

    // Créer un transporteur avec les informations du compte de test
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Définir le contenu de l'email
    const mailOptions = {
      from: '"PetsCare" <noreply@petscare.com>',
      to: 'sophiezhu.pro@gmail.com',
      subject: 'Rappel de vaccination pour Rex',
      text: `
Bonjour Sophie Zhu,

Nous espérons que vous et Rex allez bien.

Nous vous contactons pour vous rappeler que le vaccin de Rex arrive à expiration le 10 mai 2025.

Pour assurer la santé et le bien-être de votre Chien, nous vous recommandons de prendre rendez-vous pour un rappel de vaccination.

Vous pouvez prendre rendez-vous facilement en vous connectant à votre compte PetsCare ou en nous appelant au 01 23 45 67 89.

Cordialement,
L'équipe PetsCare`,
      html: `
<p>Bonjour Sophie Zhu,</p>
<p>Nous espérons que vous et Rex allez bien.</p>
<p>Nous vous contactons pour vous rappeler que le vaccin de Rex arrive à expiration le <strong>10 mai 2025</strong>.</p>
<p>Pour assurer la santé et le bien-être de votre Chien, nous vous recommandons de prendre rendez-vous pour un rappel de vaccination.</p>
<p>Vous pouvez prendre rendez-vous facilement en vous connectant à votre compte PetsCare ou en nous appelant au 01 23 45 67 89.</p>
<p>Cordialement,<br>L'équipe PetsCare</p>`,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès!');
    console.log('ID du message:', info.messageId);
    
    // URL pour visualiser l'email (uniquement disponible avec un compte Ethereal)
    console.log('URL de prévisualisation:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

// Installer d'abord: npm install nodemailer
// Puis exécuter le script
testSendEmail();