import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useParams } from "react-router-dom";

const NoteUpdate = () => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    category: "",
    date: "",
  });

  const { authorizationToken } = useAuth();
  const { id } = useParams();

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const ddmmyyyyToISO = (d) => {
    const [dd, mm, yyyy] = d.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const isoToDDMMYYYY = (d) => {
    const [yyyy, mm, dd] = d.split("-");
    return `${dd}-${mm}-${yyyy}`;
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
          date: n.date ? ddmmyyyyToISO(n.date) : "",
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
    const payload = {
      ...note,
      date: isoToDDMMYYYY(note.date),
    };

    try {
      const res = await fetch(`${backendURL}/api/notes/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Note updated successfully!");
      } else {
        alert("Note update failed.");
      }
    } catch (err) {
      console.error("Update note error:", err);
    }
  };

  return (
    <div className="md:w-1/2 w-full p-8">
      <h2 className="text-2xl font-bold mb-6">Edit Note</h2>

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
          className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
        />

        <button
          type="submit"
          className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default NoteUpdate;
