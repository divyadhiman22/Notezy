import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { useAuth } from "../store/auth";
import PopUpAlert from "../components/PopUpAlert";

const GenerateQuiz = () => {
  const { authorizationToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [modalNoteId, setModalNoteId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    onClose: () => setPopup({ ...popup, show: false }),
    onConfirm: () => setPopup({ ...popup, show: false }),
  });

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/view`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleGenerateQuiz = async (note) => {
    setGeneratingId(note._id);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notes/generate-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ content: note.content, noteId: note._id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Quiz generation failed");
      }

      const data = await response.json();

      const updatedNotes = notes.map((n) =>
        n._id === note._id ? { ...n, quiz: data.quizAndSummary } : n
      );
      setNotes(updatedNotes);

      setPopup({
        show: true,
        title: "Quiz Generated!",
        message: `Quiz successfully generated for "${note.title}"`,
        onClose: () => setPopup({ ...popup, show: false }),
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    } catch (error) {
      setPopup({
        show: true,
        title: "Error",
        message: error.message || "Something went wrong while generating quiz.",
        onClose: () => setPopup({ ...popup, show: false }),
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
    } finally {
      setGeneratingId(null);
    }
  };

  const handleDownloadPDF = (note) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(note.title, 10, 10);
    doc.setFontSize(12);
    doc.text(note.quiz, 10, 20);
    doc.save(`${note.title}-quiz.pdf`);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="text-white px-4 py-8">

      <div className="space-y-6 max-w-5xl mx-auto">
        {notes.map((note) => (
          <div key={note._id} className="bg-[#1e1e3f] p-6 rounded-xl shadow-lg border border-purple-700">
            <h3 className="text-xl font-semibold text-indigo-400 mb-2">{note.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{note.content.slice(0, 200)}...</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleGenerateQuiz(note)}
                disabled={note.quiz || generatingId === note._id}
                className={`px-5 py-2 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                  note.quiz
                    ? "bg-gray-600 cursor-not-allowed"
                    : generatingId === note._id
                    ? "bg-blue-700 text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110"
                }`}
              >
                {note.quiz
                  ? "Quiz Generated"
                  : generatingId === note._id
                  ? "Generating..."
                  : "Generate Quiz"}
              </button>

              {note.quiz && (
                <>
                  <button
                    onClick={() => setModalNoteId(note._id)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-xl font-medium hover:brightness-110 shadow-lg"
                  >
                    View Quiz
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(note)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl font-medium hover:brightness-110 shadow-lg"
                  >
                    Download PDF
                  </button>
                </>
              )}
            </div>

            {/* Modal */}
            {modalNoteId === note._id && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                <div className="bg-[#121232] text-white rounded-lg p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh] shadow-xl border border-indigo-700">
                  <button
                    onClick={() => setModalNoteId(null)}
                    className="absolute top-3 right-4 text-2xl text-red-400 hover:text-red-600 font-bold"
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4 text-purple-400">
                    Quiz for: {note.title}
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm text-green-300">{note.quiz}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PopUpAlert for quiz status */}
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

export default GenerateQuiz;
