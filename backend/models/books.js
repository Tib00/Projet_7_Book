// Ici on fait appel à mongoose pour utiliser ses fonctionnalités
// notamment la fonction schema qui va nous permettre de créer 
//le schéma de nos données livres
const mongoose = require ('mongoose');

//On utilise la fonction Schema de mongoose pour les différentes données
const bookSchema = mongoose.Schema({
    userId: {type: String, required: true}, // Id de l'utilisateur mettant le livre en ligne
    title: {type: String, required: true},  // Titre du livre
    author: {type: String, required: true}, // Nom de l'auteur
    imageUrl: {type: String, required: true}, // l'image
    year: {type: Number, required: true}, // l'année de publication
    genre: {type: String, required: true}, // le genre
    ratings: [
        {
            userId: {type: String, required: true}, //nom de l'utilisateur donnant la note
            grade: {type: Number, required: true}, // note attribuée
        }
    ],
    averageRating: {type: Number, required: true}, // note globale
});

//On utilise la méthode mongoose de calcul des notes
bookSchema.methods.calculateAverageRating = function () {
    const numberOfRatings = this.ratings.length;
    if (numberOfRatings === 0) {
      this.averageRating = 0;
    } else {
      const totalNumbers = this.ratings.reduce((accumulator, rating) => accumulator + rating.grade, 0);
      this.averageRating = Math.round(totalNumbers / numberOfRatings);
    }
  };

//Ensuite, il nous faut exporter ce que l'on a créé grâce à une autre méthode de mongoose: model
// Il nous faut 2 arguments en paramètres: le nom sous lequel nous allons l'utiliser et le schema que l'on souhaite utiliser
module.exports = mongoose.model('Book', bookSchema)