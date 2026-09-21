const express = require('express');
const router = express.Router();

const userRoutes = require('./users.routes.js');
const userWorkoutsRoutes = require('./users/workouts.routes.js');

router.use('/users', userRoutes);
router.use('/users/:userId/workouts', userWorkoutsRoutes);

module.exports = router;