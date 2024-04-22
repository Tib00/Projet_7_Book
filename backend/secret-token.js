const crypto = require('crypto'); // Importe le module crypto qui  fournit des fonctionnalités de cryptographie
const dotenv = require('dotenv'); //bibliothèque JavaScript utilisée pour charger les variables d'environnement à partir d'un fichier .env dans les applications Node.js.(sécurité des données)

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