const Note = require("../models/notes-model");
const axios = require("axios");

// CREATE a new note
const createNote = async (req, res, next) => {
    try {
        const { title, content, category, date } = req.body;

        // get user id from auth middleware
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


// Summarize note content using Hugging Face API
const summarizeNote = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required to summarize." });
    }

    // Hugging Face summarization inference API ( with bart-large-cnn)
    const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";


    const HF_API_TOKEN = process.env.HF_API_TOKEN || ""; // store in .env

    const response = await axios.post(
      API_URL,
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || response.data.error) {
      return res.status(500).json({ message: "Failed to summarize content" });
    }

    const summary = response.data[0]?.generated_text || "No summary available";

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
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
