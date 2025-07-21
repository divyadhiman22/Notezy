import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition duration-200 text-white 
     after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 
     after:bg-white after:transition-all after:duration-300 
     hover:after:w-full hover:text-gray-300
     ${isActive ? "after:w-full text-gray-300" : ""}`;

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setMenuOpen(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const avatarUrl =
    user?.profilePicture && user.profilePicture.trim() !== ""
      ? `${backendUrl}/${user.profilePicture}`
      : "https://cdn-icons-png.flaticon.com/512/12225/12225935.png";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-900 to-purple-700 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="text-white font-bold text-xl">
            Notezy
          </NavLink>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <ul className="hidden md:flex items-center space-x-6">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/notes" className={navLinkClass}>
                    Notezy
                  </NavLink>
                </li>
                <li className="relative" ref={dropdownRef}>
                  <div
                    className="cursor-pointer flex items-center space-x-2 text-white hover:text-gray-300"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  </div>

                  {showDropdown && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-md z-50">
                      <li>
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/logout"
                          className="block px-4 py-2 hover:bg-gray-100 text-red-600"
                          onClick={() => setShowDropdown(false)}
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
                      Signup
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
                      Login
                    </button>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {menuOpen && (
          <ul className="md:hidden mt-4 space-y-2 pb-4 text-center">
            <li>
              <NavLink to="/" onClick={toggleMenu} className="block text-white">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={toggleMenu} className="block text-white">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" onClick={toggleMenu} className="block text-white">
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={toggleMenu} className="block text-white">
                Contact
              </NavLink>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink to="/notes" onClick={toggleMenu} className="block text-white">
                    My Notes
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" onClick={toggleMenu} className="block text-white">
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/logout" onClick={toggleMenu} className="block text-red-400">
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup" onClick={toggleMenu}>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
                      Signup
                    </button>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" onClick={toggleMenu}>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-white px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
                      Login
                    </button>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
