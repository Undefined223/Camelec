const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/AnnouncmentController');
const { upload } = require('../utils/storage');
const { admin, protect } = require('../middleware/AdminMiddleware');

router.post('/create', upload.single('imageUrl'), protect, admin, announcementController.createAnnouncement);
router.get('/all', announcementController.getAllAnnouncements);
router.put('/:id', upload.single('imageUrl'), protect, admin, announcementController.updateAnnouncement);
router.delete('/:id', protect, admin, announcementController.deleteAnnouncement);

module.exports = router;