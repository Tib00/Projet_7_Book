const express = require('express');

const router = express.Router();

//Pour utiliser le middleware d'authentification
const auth = require('../middleware/auth');
//Pour utiliser le middleware multer qui permet de charger des images
const multer = require('../middleware/multer-config');

//Appelle la logique métier de nos routes de contrôle
const ctrlBooks = require('../controllers/books')

// Ici notre première route permettant d'aller chercher les livres présents sur la plateforme (Book1)
router.get('/',  ctrlBooks.findAllBooks);

//Ici une route pour aller cercher un livre spécifique en fonction de son id (Book2)
router.get('/:id', ctrlBooks.getOneBook);

//Tri des livres en fonction de leur notes (Book3)
router.get('/bestrating', ctrlBooks.sortByRates);

//Ajout d'un nouveau livre (Book4)
router.post('/', auth, multer, ctrlBooks.postNewBook);

//Modification d'un livre (Book5)
router.put('/:id', multer, ctrlBooks.modifyBook);

// Suppression d'un livre (Book6)
router.delete('/:id', ctrlBooks.eraseBook);

// Noter un livre (Book 7)
router.post('/:id/rating', ctrlBooks.rateBook);

module.exports = router;