const User = require("../models/user-model");


const getLoggedInUser = async (req, res, next) => {
  try {
    const id = req.user._id; 
    const user = await User.findOne({ _id: id }, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getProfileById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }, { password: 0 }); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


const updateProfileById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedUser = await User.updateOne({ _id: id }, { $set: updatedData });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};


const uploadProfilePictureById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let profilePicturePath = req.file.path;

    profilePicturePath = profilePicturePath.replace(/\\/g, "/");

    if (!profilePicturePath.startsWith("uploads/")) {
      const parts = profilePicturePath.split("uploads/");
      if (parts.length > 1) {
        profilePicturePath = "uploads/" + parts[1];
      }
    }

    const updateResult = await User.updateOne(
      { _id: id },
      { $set: { profilePicture: profilePicturePath } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or picture not updated" });
    }

    res.status(200).json({ message: "Profile picture uploaded successfully", path: profilePicturePath });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProfileById,
  updateProfileById,
  uploadProfilePictureById,
  getLoggedInUser
};
