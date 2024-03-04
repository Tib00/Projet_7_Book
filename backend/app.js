//importation des modules nécéssaires
const express = require('express'); //Express est un framework minimaliste permettant la création rapide d'API
const mongoose = require('mongoose'); // Mongoose bibliothèque pour Node.js. Elle simplifie l'interaction avec une base de données MongoDB à l'aide de modèles et d'objets JavaScript
const path = require('path');
require('dotenv').config(); //bibliothèque JavaScript utilisée pour charger les variables d'environnement à partir d'un fichier .env dans les applications Node.js.(sécurité des données)
require('./secret-token');// Appel du fichier de chargement des variables d'environnement


const livresRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const rateLimit = require('express-rate-limit');// Pour lutter contre les attaques

//on se sert de mongoose pour extraire les données de la database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//installation de express dans l'application
const app = express();

//on accede au path
//const path = require('path');

//permissions CORS
app.use((req, res, next) => {
  console.log('Middleware CORS - Requête reçue:', req.method, req.url);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  // Vérifier si la requête est une pré-vérification (preflight)
  if (req.method === 'OPTIONS') {
      console.log('Middleware CORS - Requête OPTIONS (preflight)');
      res.status(200)
          .setHeader('Content-Length', '0')
          .end();
  } else {
      // Sinon, passer à la suite
      next();
  }
});

//l'app va parser(traduire) le corps de la réponse en json ( = bodyparser)
app.use(express.json());


//Ici le chemin vers mes contrôleurs pour aller chercher mes livres
app.use('/api/books', livresRoutes);


//Ici le chemin vers mes utilisateurs
app.use('/api/auth', userRoutes);


//La route vers les images
app.use('/images', express.static(path.join(__dirname, 'images')));

//sécurité contre les attaques (brutforce et ddos)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false, 
})

app.use(limiter)

module.exports = app;