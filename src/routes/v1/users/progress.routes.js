const express = require('express');
const router = express.Router({ mergeParams: true });

const { getProgress } = require('../../../controllers/progress.controller');

router.get('/', getProgress);

module.exports = router;
