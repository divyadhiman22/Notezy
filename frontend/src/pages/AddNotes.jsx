import React, { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiSparkles } from "react-icons/hi2";

const AddNotes = () => {
  const { authorizationToken, loading } = useAuth();
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "",
    date: "",
  });
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "content") setSummary("");
  };

  const handleSummarize = async () => {
    if (!note.content.trim()) {
      toast.error("Please enter note content to summarize.");
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch("http://localhost:5000/api/notes/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ content: note.content }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        toast.success("Summary generated!");
      } else {
        toast.error(data.message || "Failed to summarize note");
      }
    } catch (error) {
      toast.error("Error while summarizing note.");
      console.error("Summarize error:", error);
    }
    setIsSummarizing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(note),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Note added successfully!");
        setNote({ title: "", content: "", category: "", date: "" });
        setSummary("");
        navigate("/notes/view");
      } else {
        toast.error(data.message || "Failed to add note");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Add note error:", error);
    }
  };


  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-xl">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-bold text-purple-400">Add New Note</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={note.title}
          onChange={handleInput}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white focus:ring-2 focus:ring-purple-500"
        />

        <textarea
          name="content"
          value={note.content}
          onChange={handleInput}
          placeholder="Content"
          rows={4}
          required
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white resize-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="button"
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="w-full flex items-center justify-center gap-2 border border-[#9333ea] text-[#9333ea] py-2 rounded-md font-semibold transition hover:bg-[#9333ea] hover:text-white disabled:opacity-50"
        >
          <HiSparkles size={20} />
          {isSummarizing ? "Summarizing..." : "Summarize Long notes with AI"}
        </button>

        {summary && (
          <div className="mt-4 p-3 bg-gray-700 rounded-md text-white whitespace-pre-wrap">
            <strong>Summary:</strong>
            <p>{summary}</p>
          </div>
        )}

        <input
          type="text"
          name="category"
          value={note.category}
          onChange={handleInput}
          placeholder="Category (e.g., study, work)"
          required
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#0a0a23] text-white focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="date"
          name="date"
          value={note.date}
          onChange={handleInput}
          required
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-white text-black focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
