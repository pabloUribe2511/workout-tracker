const express = require('express');
const router = express.Router();

// importar versiones de ruta
const v1Routes = require('./v1');

// configurar rutas versionadas
router.use('/v1', v1Routes);

// Ruta base para informacion de la api
router.get('/', (req, res) => {
    res.json({
        message: 'wprkout Tracker API',
        versions: ['v1'],
        endpints: {
            v1: '/api/v1'
        }
    })
})

module.exports = router;