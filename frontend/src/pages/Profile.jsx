/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";

const Profile = () => {
  const { authorizationToken, user: authUser, loading: authLoading } = useAuth();
  const userId = authUser?._id;

  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${backendURL}/api/user/profile/me`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data);
      setOriginalUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userId) {
      fetchProfile();
    }
  }, [authLoading, userId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !userId) return;

    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    try {
      const res = await fetch(`${backendURL}/api/user/profile/upload-picture/${userId}`, {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Profile picture updated!");
        fetchProfile();
        setImageFile(null);
      } else {
        const err = await res.json();
        alert(err.message || "Upload failed");
      }
    } catch (error) {
      alert("Upload error:", error.message || error);
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${backendURL}/api/user/profile/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          username: user.username,
          phone: user.phone,
        }),
      });

      if (res.ok) {
        alert("Profile updated!");
        setEditMode(false);
        fetchProfile();
      } else {
        const err = await res.json();
        alert(err.message || "Update failed");
      }
    } catch (error) {
      alert("Update error:", error.message || error);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  if (authLoading || profileLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-white bg-[#0a0a23]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a23] flex items-center justify-center px-4 py-10 mt-[2%] text-white">
      <div className="bg-[#111132] w-full max-w-4xl rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-semibold text-purple-400 mb-8">Edit Profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={`${backendURL}/${user.profilePicture}`}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-purple-500 object-cover"
                />
              ) : (
                <div className="w-40 h-40 bg-[#1c1c44] rounded-full flex items-center justify-center border-4 border-purple-500">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <label
                htmlFor="upload"
                className="absolute bottom-0.5 right-2 bg-[#0a0a23] border border-purple-500 rounded-full p-2 cursor-pointer hover:bg-purple-600 hover:border-purple-700 text-white text-2xl font-bold flex items-center justify-center select-none"
                title="Upload profile picture"
              >
                +
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={!imageFile}
              className={`mt-4 px-4 py-2 rounded text-white transition-colors duration-200 ${
                imageFile
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Upload
            </button>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-purple-400 mb-1">Username</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                disabled={!editMode}
                className={`w-full border rounded px-4 py-2 text-white ${
                  editMode ? "bg-[#1c1c44] border-purple-500" : "bg-[#111132] border-[#333366]"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-400 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border bg-[#111132] border-[#333366] px-4 py-2 rounded text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-400 mb-1">Phone</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                disabled={!editMode}
                className={`w-full border rounded px-4 py-2 text-white ${
                  editMode ? "bg-[#1c1c44] border-purple-500" : "bg-[#111132] border-[#333366]"
                }`}
              />
            </div>

            <div className="flex gap-4 pt-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border border-red-600 text-red-600 px-5 py-2 rounded hover:bg-red-700 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
