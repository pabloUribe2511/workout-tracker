const express = require('express');
const router = express.Router();

// importar rutas especificas
const userRoutes = require('./users.routes.js');

router.use('/users', userRoutes);

module.exports = router;