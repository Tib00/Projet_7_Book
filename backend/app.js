//importation des modules nécéssaires
const express = require('express');
const mongoose = require('mongoose');

const livresRoutes = require('./routes/books');

//on se sert de mongoose pour extraire les données de la database
mongoose.connect('mongodb+srv://tim_book:g1raf159@cluster1.lmlhago.mongodb.net/',)
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
//app.use();


//test de postman sur une base fictive de livres

// Route pour récupérer une liste fictive de livres
// app.get('/', (req, res) => {
//   const livres = [
//     { titre: 'Livre 1', auteur: 'Auteur 1' },
//     { titre: 'Livre 2', auteur: 'Auteur 2' },
//     { titre: 'Livre 3', auteur: 'Auteur 3' }
//   ];

//   res.json({ livres });
// });

//Ici le chemin vers mes contrôleurs
app.use('/', livresRoutes);

//Ici une route générique avec un message générique pour le cas où il y ait des problèmes de requêtes
app.use((req, res) => {
  res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;