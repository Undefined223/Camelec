const express = require('express');
const router = express.Router();
const { trackVisitor, getVisitorCount } = require('../controllers/visitorController');
const { admin, protect } = require('../middleware/AdminMiddleware');

router.post('/track-visit', trackVisitor);
router.get('/get-visitor-count', protect, admin, getVisitorCount);

module.exports = router;
