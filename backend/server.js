//première phase: import des modules nécéssaires
const http = require('http');
const app = require('./app');

//deuxième étape: on normalise un port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//troisième étape: installation d'un environnement. On lui fait écouter un environnement ou par défaut le port 3000
const port = normalizePort(process.env.PORT || '4000');
//on donne le port qu'on a créé à notre app.js
app.set('port', port);


//gestionnaire d'erreur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création de l'app avec http, renvoi du  serveur à l'app
const server = http.createServer(app);

//gestionnaire d'évenement, confirmation du port écouté
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le serveur écoute le port sélectionné
server.listen(port);
