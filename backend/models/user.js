// Ici on fait appel à mongoose pour utiliser ses fonctionnalités
// notamment la fonction schema qui va nous permettre de créer 
//le schéma de nos données livres
const mongoose = require ('mongoose');

//On utilise la fonction Schema de mongoose pour les différentes données
const userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password:{type: String, required: true},
});

//Ensuite, il nous faut exporter ce que l'on a créé grâce à une autre méthode de mongoose: model
// Il nous faut 2 arguments en paramètres: le nom sous lequel nous allons l'utiliser et le schema que l'on souhaite utiliser
modules.export = mongoose.model('User', userSchema)