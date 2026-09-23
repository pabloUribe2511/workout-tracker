const express = require('express');
const router = express.Router();

const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  patchExercise,
  deleteExercise
} = require('../../controllers/exercises.controller');

router.get('/', getExercises);
router.post('/', createExercise);
router.get('/:id', getExerciseById);
router.put('/:id', updateExercise);
router.patch('/:id', patchExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
