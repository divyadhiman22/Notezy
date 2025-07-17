const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const  adminMiddleware = require("../middlewares/admin-middleware")

router.route("/add").post(authMiddleware, adminMiddleware, notesController.createNote);

router.route("/view").get(authMiddleware, notesController.getAllNotes);

router.route("/note/:id").get(authMiddleware, notesController.getNoteById);

router.route("/update/:id").patch(authMiddleware, notesController.updateNoteById);

router.route("/delete/:id").delete(authMiddleware, notesController.deleteNoteById);

router.route("/summarize").post(authMiddleware, notesController.summarizeNote);

module.exports = router;
