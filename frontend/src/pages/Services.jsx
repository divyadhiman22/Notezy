import { useAuth } from "../store/auth";
import { FaRegLightbulb, FaRobot, FaLock, FaBolt } from "react-icons/fa";

const iconMap = {
  "Note Management": <FaRegLightbulb size={48} className="text-purple-400 mb-4" />,
  "AI Summarization": <FaRobot size={48} className="text-purple-400 mb-4" />,
  "Quick Access": <FaBolt size={48} className="text-purple-400 mb-4" />,
  "Secure Storage": <FaLock size={48} className="text-purple-400 mb-4" />,
};

const Services = () => {
  const { services } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white py-16 px-4 ">
      <div className="max-w-6xl mx-auto space-y-16 mt-20">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-purple-500 mb-4">Our Services</h1>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-8">
          {services.map((curElem, index) => {
            const { description, service } = curElem;

            return (
              <div
                key={index}
                className="flex flex-col items-center bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-900 rounded-2xl shadow-lg p-8 transition-transform transform hover:scale-105 text-center"
              >

                {iconMap[service] || (
                  <FaRegLightbulb size={48} className="text-purple-400 mb-4" />
                )}

                <h2 className="text-xl font-semibold text-white mb-2">{service}</h2>
                <p className="text-gray-300">{description}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Services;
