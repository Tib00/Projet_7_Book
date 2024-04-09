// 1--IMPORTATION DES MODULES NÉCESSAIRES
const Book = require('../models/books');
const fs = require('fs');

// 2-- POUR CREER UN BOOK
exports.createBook = (req, res, next) => {
    const newBook = JSON.parse(req.body.book);     
    delete newBook._id;    
    delete newBook._userId;
    const book = new Book({     
        ...newBook,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré avec succès!' }))
        .catch(error => res.status(400).json({ error }));
};

// 3-- POUR AFFICHER UN SEUL BOOK
exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// 4-- POUR MODIFIER UN BOOK 
exports.modifyBook = (req, res, next) => {
    const changeBook = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete changeBook._userId;
    Book.findOne({_id: req.params.id})   
        // verif si le userID du book et le meme que celui de la requete
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Non autorisé'});
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

// 5-- POUR SUPPRIMER UN LIVRE
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})  //recup du book avc son id
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Non autorisé'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];  
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Livre supprimé avec succès !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

// 6-- POUR AFFICHER TOUS LES BOOK 
exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
};

// 7-- POUR RECUPERER LA NOTE D'UN LIVRE
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

// 8-- POUR RECUPERER LA MOYENNE DES LIVRES
exports.getAverageRating = async (req, res, next) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        return res.status(200).json({ averageRating: book.averageRating });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// 9--RÉCUPÉRATION DES TROIS MEILLEURS LIVRES NOTÉS
exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) 
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(500).json({ error }));
};