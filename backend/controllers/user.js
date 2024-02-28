//Modèle de données de Mongoose pour des utilisateurs
const User = require('../models/user')

//Utilisation de bcrypt pour crypter les données utilisateur
const bcrypt = require('bcrypt');

//Utilisation de jsonwebtoken pour créer des token de cryptage *_*
const jwt = require('jsonwebtoken');


//Ici la logique de création d'un utilisateur (user1)
exports.signup = (req, res, next) => {
    console.log('Requête de création d\'utilisateur reçue :', req.body);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => {
                    console.log('Utilisateur créé avec succès !');
                    res.status(201).json({ message: 'Utilisateur créé !' });
                })
                .catch(error => {
                    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error);
                    res.status(400).json({ error });
                });
        })
        .catch(error => {
            console.error('Erreur lors du hachage du mot de passe :', error);
            res.status(500).json({ error });
        });
};

//Ici la logique pour la connexion d'un utilisateur (user2)
exports.login = (req, res, next) => {
    console.log('Requête de connexion reçue :', req.body);

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log('Utilisateur non trouvé');
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log('Mot de passe incorrect');
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    console.log('Utilisateur connecté avec succès');
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la comparaison des mots de passe :', error);
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de l\'utilisateur :', error);
            res.status(500).json({ error });
        });
};