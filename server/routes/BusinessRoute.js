const express = require("express");
const {
    registerBusiness,
    authBusiness,
    updateBusiness,
    getAllBusinesss,
    getBusinessById,
} = require("../controllers/BusinessController");
const { protect, admin, adminOrOwner } = require('../middleware/AdminMiddleware');
const router = express.Router();

router.post('/', registerBusiness);
router.put('/:id', protect, adminOrOwner, updateBusiness);
router.post("/login", authBusiness);
router.get("/all", protect, admin, getAllBusinesss);
router.get("/:id", protect, adminOrOwner, getBusinessById);




module.exports = router;
