/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const NotesLayout = () => {
  const { authorizationToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/view`, {
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

      const counts = data.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
      }, {});
      setCategoryCounts(counts);
    } catch (error) {
      console.error("Fetch notes error:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category === selectedCategory)
    : [];

  useEffect(() => {
    if (location.pathname === "/notes/add" || location.pathname === "/notes/view") {
      setSelectedCategory(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      selectedCategory !== null &&
      (location.pathname === "/notes/add" || location.pathname === "/notes/view")
    ) {
      setSelectedCategory(null);
      navigate("/notes");
    }
  }, [selectedCategory, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white py-16 px-4 sm:px-6 mt-[5%]">
      <h1 className="text-3xl font-extrabold text-purple-500 text-center mb-10">
        Welcome to My Notes
      </h1>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-8">
        <aside className="lg:w-1/4 w-full bg-[#15152e] rounded-xl p-6 shadow-md h-fit">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Categories</h2>
          <div className="flex flex-col gap-3">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-gray-500 italic">No categories yet</p>
            ) : (
              Object.entries(categoryCounts).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center justify-between rounded-full px-4 py-2 text-white font-medium text-sm shadow-sm
                    ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-105"
                        : "bg-purple-700 hover:bg-purple-600"
                    }`}
                >
                  <span>{category}</span>
                  <span className="ml-2 w-6 h-6 flex items-center justify-center bg-white text-purple-700 rounded-full text-xs font-bold">
                    {count}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex-1 flex flex-col items-center">
          <nav className="mb-10 w-full max-w-3xl">
            <ul className="flex flex-wrap justify-center gap-6 text-base font-medium">
              <li>
                <NavLink
                  to="/notes/add"
                  className={({ isActive }) =>
                    `px-6 py-3 rounded-xl transition duration-300 font-semibold flex items-center gap-2 shadow-md ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105"
                        : "bg-[#1f1f3a] text-purple-300 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  ➕ Add Note
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notes/view"
                  className={({ isActive }) =>
                    `px-6 py-3 rounded-xl transition duration-300 font-semibold flex items-center gap-2 shadow-md ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105"
                        : "bg-[#1f1f3a] text-purple-300 hover:bg-purple-600 hover:text-white"
                    }`
                  }
                >
                  📓 View Notes
                </NavLink>
              </li>
            </ul>
          </nav>

          <main className="w-full max-w-4xl min-h-[350px] p-4 bg-[#1f1f3a] rounded-xl shadow-md">
            {!selectedCategory && location.pathname === "/notes" && (
              <p className="text-gray-400 italic text-center">
                Select a category on the left to view notes.
              </p>
            )}

            {selectedCategory && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-purple-300">
                  Notes in "{selectedCategory}"
                </h3>
                {filteredNotes.length === 0 ? (
                  <p className="text-gray-400 italic">No notes in this category.</p>
                ) : (
                  <ul className="space-y-3">
                    {filteredNotes.map((note) => (
                      <li
                        key={note._id}
                        className="bg-purple-700 rounded-md p-4 shadow-md"
                      >
                        <h4 className="font-semibold text-white">{note.title}</h4>
                        <p className="text-purple-200 mt-1">{note.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {!selectedCategory && <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesLayout;
