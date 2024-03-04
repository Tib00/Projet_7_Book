//importation des modules nécéssaires
const express = require('express'); //Express est un framework minimaliste permettant la création rapide d'API
const mongoose = require('mongoose'); // Mongoose bibliothèque pour Node.js. Elle simplifie l'interaction avec une base de données MongoDB à l'aide de modèles et d'objets JavaScript
const path = require('path');
require('dotenv').config(); //bibliothèque JavaScript utilisée pour charger les variables d'environnement à partir d'un fichier .env dans les applications Node.js.(sécurité des données)
require('./secret-token');// Appel du fichier de chargement des variables d'environnement
const databaseURL = process.env.DATABASE_URL;

const livresRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

//on se sert de mongoose pour extraire les données de la database
mongoose.connect(databaseURL)
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

//Ici une route générique avec un message générique pour le cas où il y ait des problèmes de requêtes
// app.use((req, res) => {
//   console.log('Route générique - Requête reçue');
//   res.json({ message: 'Votre requête a bien été reçue !' }); 
// });

//Ici le chemin vers mes utilisateurs
app.use('/api/auth', userRoutes);


//La route vers les images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;