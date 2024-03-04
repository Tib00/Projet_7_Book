const crypto = require('crypto');
const dotenv = require('dotenv');

const generateRandomToken = () => {
    const buffer = crypto.randomBytes(64);
    return buffer.toString('hex');
};

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();


let randomToken;

// Si TOKEN_SECRET n'est pas déjà défini dans les variables d'environnement, générer un token aléatoire
if (!process.env.TOKEN_SECRET) {
    randomToken = generateRandomToken();
    process.env.TOKEN_SECRET = randomToken;
} else {
    // Si TOKEN_SECRET est déjà défini, utiliser sa valeur existante
    console.log("TOKEN_SECRET déjà défini :", process.env.TOKEN_SECRET);
}