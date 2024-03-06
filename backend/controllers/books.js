const Books = require('../models/books')
const mongoose = require('mongoose');

//La constante fs appelle filesysteme, une fonctionalité qui nous permet d'avoir accès 
//aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');

//Ici la logique de la route Book1
exports.findAllBooks = (req, res, next) => {
    // Supposons que Books.find() renvoie une promesse
    Books.find()
        .then(livres => {
            // Vous pouvez envoyer directement le tableau de livres comme réponse JSON
            res.status(200).json(livres);
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des livres.' });
        });
}
//Ici la logique de la route Book2
exports.getOneBook = (req, res, next) => {
    Books.findOne({
        _id: req.params.id
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

//Ici la logique de la route Book3 pour trier les livres en fonction de leurs notation
exports.sortByRates = (req, res, next) => {
    // Supposons que Books.find() renvoie une promesse
    Books.find()
        .then(livres => {
            // Triez les livres par note (supposons que chaque livre a une propriété 'note')
            const livresTries = livres.sort((a, b) => b.note - a.note);

            // Vous pouvez envoyer le tableau de livres triés comme réponse JSON
            res.status(200).json({
                livres: livresTries,
                message: 'Nos meilleures ventes !'
            });
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des livres.' });
        });
}

//Ici la logique de la route Book4 de création/ ajout de livre
exports.postNewBook = (req, res, next) => {
    // Récupérer les données du livre depuis le corps de la requête
    const bookData = JSON.parse(req.body.book);

    // Créer un nouveau livre à partir des données reçues
    const nouveauLivre = new Books({
        ...bookData,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    
    // Sauvegarder le nouveau livre dans la base de données
    nouveauLivre.save()
        .then(livreSauvegarde => {
            // Répondre avec un message de succès et le nouveau livre ajouté
            res.status(201).json({
                message: 'Livre ajouté avec succès !',
                livre: livreSauvegarde
            });
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de l\'ajout du livre.' });
        });
}

//Ici la logique de la route Book5 de modification de livre
exports.modifyBook = (req, res, next) => {
    const changeBook = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete changeBook._userId;

    // Utiliser Mongoose pour trouver le livre par son ID
    Books.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }

            // Mettre à jour le livre avec les modifications
            Books.updateOne({ _id: req.params.id }, { ...changeBook, _id: req.params.id })
                .then(() => {
                    res.status(200).json({ message: 'Livre modifié avec succès!' });
                })
                .catch(updateError => {
                    console.error("Erreur lors de la modification du livre:", updateError);
                    res.status(500).json({ error: 'Erreur lors de la modification du livre.' });
                });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche du livre:", error);
            res.status(400).json({ error });
        });
};



// Route Book6 avec multer et fs pour supprimer un livre
exports.eraseBook = (req, res, next) => {
    const livreId = req.params.id;

    // Utiliser Mongoose pour supprimer le livre correspondant
    Books.findOneAndDelete({ _id: livreId })
        .then(() => {
            res.status(200).json({
                message: 'Livre supprimé !'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression du livre.' });
        });
};

//Ici la logique de la route Book7 pour noter un livre
exports.rateBook = (req, res, next) => {
    const livreId = req.params.id;
    const userId = req.body.userId; // Supposons que l'ID de l'utilisateur est dans le corps de la requête
    const grade = req.body.rating;   // Supposons que la note est dans le corps de la requête

        // Validation de l'ObjectId
        if (!mongoose.Types.ObjectId.isValid(livreId)) {
            return res.status(400).json({ error: 'ID de livre invalide.' });
        }

    // Vérifier si les données nécessaires sont présentes dans la requête
    if (!userId) {
        console.log('ID de l\'utilisateur manquant dans la requête.');
        return res.status(400).json({ error: 'L\'ID de l\'utilisateur est manquant dans la requête.' });
    }

if (!grade) {
    console.log('Note attribuée manquante dans la requête.');
    return res.status(400).json({ error: 'La note attribuée est manquante dans la requête.' });
}
    
        // Log des données pour déboguer
        console.log('ID du livre :', livreId);
        console.log('ID de l\'utilisateur :', userId);
        console.log('Note attribuée :', grade);

    // Utiliser Mongoose pour trouver le livre par son ID
    Books.findById(livreId)
        .then(livre => {
            if (!livre) {
                return res.status(404).json({ error: 'Livre non trouvé.' });
            }

            // Ajouter une nouvelle notation au tableau de notations
            livre.ratings.push({ userId: userId, grade: grade });

            // Calculer la nouvelle note moyenne
            const totalRatings = livre.ratings.length;
            const totalGrade = livre.ratings.reduce((acc, rating) => acc + rating.grade, 0);
            livre.averageRating = totalRatings > 0 ? totalGrade / totalRatings : 0;

            // Sauvegarder les modifications dans la base de données
            return livre.save();
        })
        .then(() => {
            res.status(201).json({
                message: 'Livre noté avec succès !'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la notation du livre.' });
        });
}