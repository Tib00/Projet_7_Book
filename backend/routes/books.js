const express = require('express');

const router = express.Router();

//Pour utiliser le middleware d'authentification
const auth = require('../middleware/auth');
//Pour utiliser le middleware multer qui permet de charger des images
const multer = require('../middleware/multer-config');

//Appelle la logique métier de nos routes de contrôle
const ctrlBooks = require('../controllers/books')

//Ici les différentes routes
router.get('/', ctrlBooks.getAllBook); //Pour obtenir tous les livres
router.get('/bestrating', ctrlBooks.getBestRatedBooks);  // pour obtenir les mieux notés
router.get('/:id', ctrlBooks.getOneBook); // pour aller chercher 1 livre
router.put('/:id', auth, multer, ctrlBooks.modifyBook); // Pour modifier un livre
router.post('/:id/rating', auth, ctrlBooks.rateBook);  // Pour noter un livre
router.post('/', auth, multer, ctrlBooks.createBook);  // Pour créer un livre
router.delete('/:id', auth, ctrlBooks.deleteBook);  //Pour supprimer un livre

module.exports = router;