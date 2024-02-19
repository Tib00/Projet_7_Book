const Books = require('../models/books')


//Ici la logique de la route Book1
exports.findAllBooks = (req, res, next) => {
    // Supposons que Books.find() renvoie une promesse
    Books.find()
        .then(livres => {
            // Vous pouvez envoyer le tableau de livres comme réponse JSON
            res.status(200).json({
                livres: livres,
                message: 'Voici votre sélection de livres !'
            });
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des livres.' });
        });
}

//Ici la logique de la route Book2
exports.findOneBook = (req, res, next) => {
    const livreId = req.params.id;

    // Books.findById() renvoie une promesse
    Books.findById(livreId)
        .then(livre => {
            if (!livre) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }

            // Envoyer les détails du livre comme réponse JSON
            res.status(200).json({
                livre: livre,
                message: 'Voici votre livre !'
            });
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération du livre.' });
        });
}

//Ici la logique de la route Book3
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

//Ici la logique de la route Book4
exports.postNewBook = (req, res, next) => {
    // Créer un nouveau livre à partir des données reçues dans req.body
    const nouveauLivre = new Books({
        userId: req.body.userId,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre,
        ratings: [],
        averageRating: 0
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

//Ici la logique de la route Book5
exports.modifBooks = (req, res, next) => {
    const livreId = req.params.id;

    // Utiliser Mongoose pour mettre à jour le livre correspondant
    Book.findByIdAndUpdate(livreId, req.body)
        .then(() => {
            res.status(200).json({
                message: 'Livre modifié !'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la modification du livre.' });
        });
}

//Ici la logique de la route Book6
exports.eraseBook = (req, res, next) => {
    const livreId = req.params.id;

    // Utiliser Mongoose pour supprimer le livre correspondant
    Book.findByIdAndRemove(livreId)
        .then(() => {
            res.status(200).json({
                message: 'Livre supprimé !'
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression du livre.' });
        });
}

//Ici la logique de la route Book7
exports.rateBook = (req, res, next) => {
    const livreId = req.params.id;
    const userId = req.body.userId; // Supposons que l'ID de l'utilisateur est dans le corps de la requête
    const grade = req.body.grade;   // Supposons que la note est dans le corps de la requête

    // Utiliser Mongoose pour trouver le livre par son ID
    Book.findById(livreId)
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