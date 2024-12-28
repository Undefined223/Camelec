const express = require("express");
const {
    registerUser,
    authUser,
    updateUser,
    getAllUsers,
    getUserById,
} = require("../controllers/userController");
const { protect, admin, adminOrOwner } = require('../middleware/AdminMiddleware');
const { upload } = require("../utils/storage");
const router = express.Router();

router.post('/', upload.single('pic'), registerUser);
router.put('/:id', upload.single('pic'), protect, adminOrOwner, updateUser);
router.post("/login", authUser);
router.get("/all", protect, admin, getAllUsers);
router.get("/:id", protect, adminOrOwner, getUserById);




module.exports = router;
