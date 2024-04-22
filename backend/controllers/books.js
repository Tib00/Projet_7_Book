// Importation des modules nécéssaires à la création des chemins
const Book = require('../models/books');
const fs = require('fs'); //filesystem permet d'interagir avec le système de l'utilisateur

// Créer un book
exports.createBook = (req, res, next) => {
    const newBook = JSON.parse(req.body.book);     
    delete newBook._id;   // MongoDB génère un ID à chaque nouvelle entrée. On supprime celle potentielle de l'utilisateur 
    delete newBook._userId; // Notre utilisateur est identifié grâce à un jeton JWT. On supprime son user de la requête pour éviter les fuites de données personelles.
    const book = new Book({     
        ...newBook,
        userId: req.auth.userId,  // associe un livre à un id d'utilisateur afin de déterminer qui à enregistré le livre.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré avec succès!' }))
        .catch(error => res.status(400).json({ error }));
};

// Afficher un seul livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Modification d'un livre
exports.modifyBook = (req, res, next) => {
    const changeBook = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete changeBook._userId; // supprime l'Id de l'utilisateur avant changement pour protéger les données sensibles (RGPD)
    Book.findOne({_id: req.params.id})   
        // verif si le ID du book et le meme que celui de la requete
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'}); // On vérifie que l'utilisateur a bien le droit de supprimer le livre
            } else {
                Book.updateOne({ _id: req.params.id}, { ...changeBook, _id: req.params.id})
                    .then(() => res.status(200).json({ message : 'Livre modifié avec succès!'}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})  //recup du book avc son id
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Non autorisé'});
            } else {
                const filename = book.imageUrl.split('/images/')[1]; // On supprime d'abord l'image pour garantir l'intégrité des deonnées, éviter d'avoir des images sans données associées 
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})  // On supprime les données
                        .then(() => { res.status(200).json({message: 'Livre supprimé avec succès !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

// Afficher tous les livres
exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
};

// Noter un livre
exports.rateBook = async (req, res, next) => {
    const bookId =  req.params.id
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        const { userId, rating } = req.body;
        if (book.ratings.some((rating) => rating.userId === userId)) {
            return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
        }
        book.ratings.push({ userId:userId, grade: rating });
        await book.calculateAverageRating();
       
        book.save()
        .then (( ) => {
            res.status (200).json (book)
        })
        .catch ((error) => { res.statut (500).json({ error })})
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// Récupération de la note moyenne des livres
exports.getAverageRating = async (req, res, next) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        return res.status(200).json({ averageRating: book.averageRating });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// Récupérer les 3 meilleurs livres notés
exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) 
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(500).json({ error }));
};