const crypto = require('crypto');
const dotenv = require('dotenv');

const generateRandomToken = () => {
    const buffer = crypto.randomBytes(64);
    return buffer.toString('hex');
};

// Générer le token aléatoire
const randomToken = generateRandomToken();

// Définir la variable d'environnement TOKEN_SECRET
process.env.TOKEN_SECRET = randomToken;

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Afficher le token généré
console.log("TOKEN_SECRET généré et défini :", randomToken);