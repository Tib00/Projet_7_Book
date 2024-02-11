//importation des modules nécéssaires
const express = require('express');
const mongoose = require('mongoose');

//on se sert de mongoose pour extraire les données de la database
mongoose.connect('mongodb+srv://tim_book:g1raf159@cluster1.lmlhago.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//installation de express dans l'application
const app = express();

//l'app va parser(traduire) le corps de la réponse en json ( = bodyparser)
app.use(express.json());

//permissions CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//On relie notre app à notre fichier de routage
app.use();

module.exports = app;