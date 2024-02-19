const express = require('express');
const router = express.Router();

const ctrlUsers = require('../controllers/user')


// Route POST pour la création d'un utilisateur (user1)
router.post('/signup', ctrlUsers.signup);

// Route POST pour la connexion d'un utilisateur (user2)
router.post('/login', ctrlUsers.login);

module.exports = router;