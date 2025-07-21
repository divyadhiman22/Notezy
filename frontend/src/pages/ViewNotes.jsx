/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import PopUpAlert from "../components/PopUpAlert";

const ViewNotes = () => {
  const { authorizationToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    title: "",
    onConfirm: null,
    onClose: null,
  });

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
      setPopup({
        show: true,
        message: error.message,
        title: "Fetch Error",
        onConfirm: null,
        onClose: () => setPopup({ ...popup, show: false }),
      });
    }
  };

  const confirmDeleteNote = (id) => {
    setPopup({
      show: true,
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this note?",
      onConfirm: () => handleDelete(id),
      onClose: () => setPopup({ ...popup, show: false }),
    });
  };

  const handleDelete = async (id) => {
    setPopup({ ...popup, show: false });

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
      setPopup({
        show: true,
        title: "Delete Failed",
        message: error.message,
        onConfirm: null,
        onClose: () => setPopup({ ...popup, show: false }),
      });
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
              <h2 className="text-2xl font-semibold text-indigo-300 mb-2">
                {title}
              </h2>
              <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                {content.length > 200 ? content.slice(0, 200) + "..." : content}
              </p>

              <div className="text-sm text-gray-400 mb-5 space-y-1">
                <p>
                  <span className="font-medium text-indigo-400">Category:</span>{" "}
                  {category}
                </p>
                <p>
                  <span className="font-medium text-indigo-400">Date:</span>{" "}
                  {new Date(date).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Link
                  to={`/notes/note/${_id}/edit`}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110"
                >
                  <FaEdit className="text-base" /> Edit
                </Link>

                <button
                  onClick={() => confirmDeleteNote(_id)}
                  className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110"
                >
                  <FaTrash className="text-base" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {popup.show && (
        <PopUpAlert
          title={popup.title}
          message={popup.message}
          onClose={popup.onClose}
          onConfirm={popup.onConfirm}
        />
      )}
    </div>
  );
};

export default ViewNotes;
