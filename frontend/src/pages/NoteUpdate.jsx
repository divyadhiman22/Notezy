import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useParams, useNavigate } from "react-router-dom";
import PopUpAlert from "../components/PopUpAlert";

const NoteUpdate = () => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "",
    date: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    onClose: () => setPopup({ ...popup, show: false }),
    onConfirm: () => setPopup({ ...popup, show: false }),
  });

  const { authorizationToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const formatDateForInput = (rawDate) => {
    const d = new Date(rawDate);
    if (isNaN(d)) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    const getSingleNote = async () => {
      try {
        const res = await fetch(`${backendURL}/api/notes/note/${id}`, {
          headers: { Authorization: authorizationToken },
        });
        const data = await res.json();
        const n = data.note ? data.note : data;

        setNote({
          title: n.title || "",
          content: n.content || "",
          category: n.category || "",
          date: n.date ? formatDateForInput(n.date) : "",
        });
      } catch (err) {
        console.error("Fetch note error:", err);
      }
    };

    getSingleNote();
  }, [authorizationToken, id, backendURL]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendURL}/api/notes/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(note),
      });

      if (res.ok) {
        setPopup({
          show: true,
          title: "Success",
          message: "Note updated successfully!",
          onClose: () => {
            setPopup({ ...popup, show: false });
            navigate("/notes");
          },
          onConfirm: () => {
            setPopup({ ...popup, show: false });
            navigate("/notes");
          },
        });
      } else {
        setPopup({
          show: true,
          title: "Error",
          message: "Note update failed.",
          onClose: () => setPopup({ ...popup, show: false }),
          onConfirm: () => setPopup({ ...popup, show: false }),
        });
      }
    } catch (err) {
      console.error("Update note error:", err);
      setPopup({
        show: true,
        title: "Error",
        message: "An error occurred during update.",
        onClose: () => setPopup({ ...popup, show: false }),
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    }
  };

  const handleClose = () => {
    navigate("/notes");
  };

  return (
    <div className="md:w-1/2 w-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Note</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="title"
          value={note.title}
          onChange={handleInput}
          placeholder="Note Title"
          required
          className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
        />

        <textarea
          name="content"
          value={note.content}
          onChange={handleInput}
          placeholder="Note Content"
          rows={5}
          required
          className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
        />

        <input
          name="category"
          value={note.category}
          onChange={handleInput}
          placeholder="Category"
          className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
        />

        <input
          type="date"
          name="date"
          value={note.date}
          onChange={handleInput}
          className="w-full p-3 rounded bg-white text-black border border-gray-600"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>

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

export default NoteUpdate;
