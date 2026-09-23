const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getProgress,
  getProgressById,
  createProgress,
  updateProgress,
  patchProgress,
  deleteProgress
} = require('../../../controllers/progress.controller');

router.get('/', getProgress);
router.get('/:id', getProgressById);
router.post('/', createProgress);
router.put('/:id', updateProgress);
router.patch('/:id', patchProgress);
router.delete('/:id', deleteProgress);

module.exports = router;
