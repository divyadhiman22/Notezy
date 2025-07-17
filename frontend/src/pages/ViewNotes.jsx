/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewNotes = () => {
  const { authorizationToken } = useAuth();
  const [notes, setNotes] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/notes/view`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Fetch notes error:", error);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/notes/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete note");
      }

      fetchNotes();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-400">
        📝 My Notes
      </h1>

      {notes.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No notes found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(({ _id, title, content, category, date }) => (
            <div
              key={_id}
              className="bg-[#1e293b] rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 border border-slate-700"
            >
              <h2 className="text-2xl font-semibold text-indigo-300 mb-2">{title}</h2>
              <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                {content.length > 200 ? content.slice(0, 200) + "..." : content}
              </p>

              <div className="text-sm text-gray-400 mb-5 space-y-1">
                <p>
                  <span className="font-medium text-indigo-400">Category:</span> {category}
                </p>
                <p>
                  <span className="font-medium text-indigo-400">Date:</span>{" "}
                  {new Date(date).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Link
                  to={`/notes/note/${_id}/edit`}
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-full flex items-center gap-2 font-medium text-sm hover:bg-indigo-500 hover:scale-105 transition-all shadow-md"
                >
                  <FaEdit className="text-sm" /> Edit
                </Link>
                <button
                  onClick={() => deleteNote(_id)}
                  className="bg-rose-600 text-white px-4 py-1.5 rounded-full flex items-center gap-2 font-medium text-sm hover:bg-rose-500 hover:scale-105 transition-all shadow-md"
                >
                  <FaTrash className="text-sm" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewNotes;
