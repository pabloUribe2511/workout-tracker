const express = require('express');
const router = express.Router();

const {
  getExercises,
  getExerciseById
} = require('../../controllers/exercises.controller');

router.get('/', getExercises);
router.get('/:id', getExerciseById);

module.exports = router;
