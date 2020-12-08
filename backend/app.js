const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Mikdream:Dy3z5zAuP2FkmgP@apisopekocko.0li2a.mongodb.net/apisopekocko?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussi !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;