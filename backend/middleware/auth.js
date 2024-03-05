const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       console.log('Token reçu du frontend :', token); // Ajout de ce log
       console.log('Token demandé par le backend pour vérification :', process.env.TOKEN_SECRET);
       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
       console.log('Token décodé :', decodedToken); // Ajout de ce log

       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       console.error('Erreur lors de la vérification du token :', error); // Ajout de ce log
       res.status(401).json({ error });
   }
};
