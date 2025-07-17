/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth"; 
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 

  return (
    <div className="bg-[#0a0a23] min-h-screen text-white font-sans pt-[5%]">
      <div className="w-[90%] min-h-[87.5vh] flex flex-col lg:flex-row justify-between items-center mx-auto py-16 lg:py-20 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[50%] text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
            Capture Your <br />
            <span className="block mt-4 md:mt-6 relative">
              <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-700 text-transparent bg-clip-text">
                THOUGHTS
              </span>
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-6">
            Organize your notes effortlessly and stay productive.
          </p>

          <button
            onClick={() => navigate(isLoggedIn ? "/notes" : "/login")}
            className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-8 py-3 rounded-md font-semibold text-lg"
          >
            {isLoggedIn ? "Generate Notes" : "Get Started"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex space-x-2 md:space-x-4 w-full lg:w-[50%] justify-center"
        >
          <div className="w-24 md:w-32 lg:w-40 h-48 md:h-56 lg:h-64 bg-[#0a0a23] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
            <img
              src="https://i.pinimg.com/736x/b7/6e/49/b76e497887d90c7da5c0d4a62d138fae.jpg"
              alt="Artwork 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-24 md:w-32 lg:w-40 h-52 md:h-60 lg:h-72 bg-[#0a0a23] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
            <img
              src="https://cdn.prod.website-files.com/66bf05dee8c5f0991d608526/67052df8acee2f2eba3fca4a_Digital%20Notes.png"
              alt="Artwork 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-24 md:w-32 lg:w-40 h-48 md:h-56 lg:h-64 bg-[#0a0a23] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
            <img
              src="https://djnw5a0wszky0.cloudfront.net/inkfactorywp/wp-content/uploads/2016/12/Blog_7-Digital-Tools_Header-Image_1920x1080-1900x1069.jpg.webp"
              alt="Artwork 3"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Other Sections */}
      <About />
      <Services />
      <Contact />

      <Footer/>
    </div>
  );
};

export default Home;
