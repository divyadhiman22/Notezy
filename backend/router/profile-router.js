const express = require("express");
const profileController = require("../controllers/profile-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const upload = require("../middlewares/upload-middleware");

router.route('profile/:id').get(authMiddleware, profileController.getProfileById);

router.route('/profile/me').get(authMiddleware, profileController.getLoggedInUser);

router.route('/profile/update/:id').patch(authMiddleware, profileController.updateProfileById);

router.route('/profile/upload-picture/:id').post(authMiddleware, upload.single("profilePicture"), profileController.uploadProfilePictureById);

module.exports = router;
