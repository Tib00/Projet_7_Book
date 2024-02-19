//Modèle de données de Mongoose pour des utilisateurs
const User = require('../models/user')

//Ici la logique de création d'un utilisateur (user1)
exports.createNewUser = (req, res, next) => {
    // Vérifier si l'email et le mot de passe sont présents dans le corps de la requête
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
    }

    // Créer un nouvel utilisateur à partir des données reçues dans req.body
    const newUser = new User({
        email: email,
        password: password,
    });

    // Sauvegarder le nouvel utilisateur dans la base de données
    newUser.save()
        .then(userSaved => {
            // Répondre avec un message de succès et le nouvel utilisateur ajouté
            res.status(201).json({
                message: 'Utilisateur créé avec succès !',
                user: userSaved
            });
        })
        .catch(error => {
            // En cas d'erreur, renvoyer une réponse d'erreur
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
        });
}

//Ici la logique pour la connection d'un utilisateur (user2)

exports.verifUser = (req, res, next) => {
    // Vérifier si l'email et le mot de passe sont présents dans le corps de la requête
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
    }

    // Rechercher l'utilisateur dans la base de données par son email
    User.findOne({ email: email })
        .then(user => {
            // Vérifier si l'utilisateur existe
            if (!user) {
                return res.status(401).json({ message: 'L\'utilisateur n\'existe pas.' });
            }

            // Vérifier si le mot de passe correspond
            bcrypt.compare(password, user.password)
                .then(passwordMatch => {
                    if (passwordMatch) {
                        // Le mot de passe correspond, l'utilisateur est authentifié
                        res.status(200).json({ message: 'Connexion réussie !', user: user });
                    } else {
                        // Le mot de passe ne correspond pas
                        res.status(401).json({ message: 'Mot de passe incorrect.' });
                    }
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe.' });
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la recherche de l\'utilisateur.' });
        });
}