import { NavLink } from 'react-router-dom';

const Error = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a23] text-white px-4">
      <div className="text-center max-w-xl space-y-6">
        <h2 className="text-6xl font-bold text-purple-500">404</h2>
        <h4 className="text-2xl font-semibold">Sorry! Page not found</h4>
        <p className="text-gray-300">
          Oops! It seems like the page you're trying to access doesn't exist.
          <br />
          If you believe there's an issue, feel free to report it, and we'll look into it.
        </p>

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <NavLink
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            Return Home
          </NavLink>
          <NavLink
            to="/contact"
            className="border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded transition"
          >
            Report Problem
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Error;
