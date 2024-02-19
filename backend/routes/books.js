const express = require('express');

const router = express.Router();

//Pour utiliser le middleware d'authentification
const auth = require('../middleware/auth');

const ctrlBooks = require('../controllers/books')

// Ici notre première route permettant d'aller chercher les livres présents sur la plateforme (Book1)
router.get('/', auth, ctrlBooks.findAllBooks);

//Ici une route pour aller cercher un livre spécifique en fonction de son id (Book2)
router.get('/:id', ctrlBooks.findOneBook);

//Tri des livres en fonction de leur notes (Book3)
router.get('/bestrating', ctrlBooks.sortByRates);

//Ajout d'un nouveau livre (Book4)
router.post('/', ctrlBooks.postNewBook);

//Modification d'un livre (Book5)
router.put('/:id', ctrlBooks.modifBooks);

//suppression d'un livre (Book6)
router.delete('/:id', ctrlBooks.eraseBook);

// Noter un livre (Book 7)
router.post('/:id/rating', ctrlBooks.rateBook);

module.exports = router;