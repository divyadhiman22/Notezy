const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const  adminMiddleware = require("../middlewares/admin-middleware")
// CREATE a new note
router.route("/add").post(authMiddleware, adminMiddleware, notesController.createNote);

// READ all notes
router.route("/view").get(authMiddleware, notesController.getAllNotes);

// READ a single note by ID
router.route("/note/:id").get(authMiddleware, notesController.getNoteById);

// UPDATE a note by ID
router.route("/update/:id").patch(authMiddleware, notesController.updateNoteById);

// DELETE a note by ID
router.route("/delete/:id").delete(authMiddleware, notesController.deleteNoteById);


// for summarizing notes
router.route("/summarize").post(authMiddleware, notesController.summarizeNote);

module.exports = router;
