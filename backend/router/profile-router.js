const express = require("express");
const profileController = require("../controllers/profile-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const upload = require("../middlewares/upload-middleware");

// GET profile by user ID
router.route('profile/:id')
  .get(authMiddleware, profileController.getProfileById);

// GET current logged-in user's profile
router.route('/profile/me')
  .get(authMiddleware, profileController.getLoggedInUser);


// PATCH update profile by user ID
router.route('/profile/update/:id')
  .patch(authMiddleware, profileController.updateProfileById);

// POST upload profile picture by user ID
router.route('/profile/upload-picture/:id')
  .post(authMiddleware, upload.single("profilePicture"), profileController.uploadProfilePictureById);

module.exports = router;
