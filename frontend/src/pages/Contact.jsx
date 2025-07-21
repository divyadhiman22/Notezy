import { useState, useEffect } from 'react';
import { useAuth } from "../store/auth";
import PopUpAlert from "../components/PopUpAlert";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Contact = () => {
  const { user, loading } = useAuth();

  const [contact, setContact] = useState({
    username: '',
    email: '',
    message: '',
  });

  const [popup, setPopup] = useState({
    show: false,
    title: '',
    message: '',
    onClose: () => setPopup({ ...popup, show: false }),
    onConfirm: () => setPopup({ ...popup, show: false }),
  });

  useEffect(() => {
    if (!loading && user) {
      setContact((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [loading, user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/form/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        setPopup({
          show: true,
          title: "Success",
          message: "Message sent!",
          onClose: () => {
            setPopup({ ...popup, show: false });
            setContact({ username: '', email: '', message: '' });
          },
          onConfirm: () => {
            setPopup({ ...popup, show: false });
            setContact({ username: '', email: '', message: '' });
          }
        });
      } else {
        const err = await response.json();
        throw new Error(err.message || "Message failed to send.");
      }
    } catch (error) {
      setPopup({
        show: true,
        title: "Error",
        message: error.message || "An error occurred while sending your message.",
        onClose: () => setPopup({ ...popup, show: false }),
        onConfirm: () => setPopup({ ...popup, show: false }),
      });
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
    <div className="bg-[#0a0a23] text-white min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full bg-[#111132] rounded-lg overflow-hidden shadow-lg mt-20">
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-bold mb-6">Contact Me</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={contact.username}
              id="username"
              name="username"
              autoComplete="off"
              onChange={handleInput}
              required
              className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={contact.email}
              id="email"
              name="email"
              autoComplete="off"
              onChange={handleInput}
              required
              className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
            />
            <textarea
              placeholder="Message"
              name="message"
              value={contact.message}
              id="message"
              autoComplete="off"
              rows={4}
              onChange={handleInput}
              required
              className="w-full p-3 rounded bg-[#0a0a23] border border-gray-600 text-white"
            ></textarea>
            <button
              type="submit"
              className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              Send
            </button>
          </form>
        </div>

        <div className="md:w-1/2 w-full p-8 flex justify-center items-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/contact-us-illustration-download-in-svg-png-gif-file-formats--call-logo-laptop-helping-customer-service-pack-network-communication-illustrations-2912020.png?f=webp"
            alt="Contact Illustration"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>

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

export default Contact;
