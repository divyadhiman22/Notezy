const Note = require("../models/notes-model");
const axios = require("axios");

// CREATE a new note
const createNote = async (req, res, next) => {
    try {
        const { title, content, category, date } = req.body;

        const userId = req.user._id; 

        const newNote = new Note({ 
            user: userId,
            title, 
            content, 
            category, 
            date 
        });
        await newNote.save();

        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        next(error);
    }
};


// READ all notes
const getAllNotes = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const notes = await Note.find({ user: userId });
        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};


// READ a single note by ID
const getNoteById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;
        const note = await Note.findOne({ _id: id, user: userId }); 

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

// UPDATE a note by ID
const updateNoteById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedNoteData = req.body;

        const updatedNote = await Note.updateOne({ _id: id }, { $set: updatedNoteData });

        res.status(200).json({ message: "Note updated successfully", result: updatedNote });
    } catch (error) {
        next(error);
    }
};

// DELETE a note by ID
const deleteNoteById = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Note.deleteOne({ _id: id });

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        next(error);
    }
};


// Summarize note content with AI
const summarizeNote = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length < 20) {
      return res.status(400).json({ message: "Content is too short to summarize." });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `Summarize the following text:\n\n${content}`;

    const response = await axios.post(
      API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      return res.status(500).json({ message: "No summary available." });
    }

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Summarize error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Error during summarization" });
  }
};


module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNoteById,
    deleteNoteById,
    summarizeNote
};
