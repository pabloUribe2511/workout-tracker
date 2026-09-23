const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  patchWorkout,
  deleteWorkout
} = require('../../../controllers/workouts.controller');

router.get('/', getUserWorkouts);
router.post('/', createWorkout);
router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.patch('/:id', patchWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;
