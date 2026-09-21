const express = require('express');
const router = express.Router();

const userRoutes = require('./users.routes.js');
const exercisesRoutes = require('./exercises.routes.js');
const userWorkoutsRoutes = require('./users/workouts.routes.js');
const userProgressRoutes = require('./users/progress.routes.js');

router.use('/users', userRoutes);
router.use('/exercises', exercisesRoutes);
router.use('/users/:userId/workouts', userWorkoutsRoutes);
router.use('/users/:userId/progress', userProgressRoutes);

module.exports = router;