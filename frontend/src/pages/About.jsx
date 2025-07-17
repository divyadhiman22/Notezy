import { useAuth } from "../store/auth";

const About = () => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a23] text-white flex items-center justify-center text-xl">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-16 mt-20">


        <section className="text-center">
          <p>Welcome {user?.username}</p>
          <h1 className="text-4xl font-bold text-purple-500 mb-4">
            Why Choose Our Note App?
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our smart note-taking app is designed to help you capture ideas, organize your thoughts, and boost your productivity with powerful AI features like instant summarization of long notes.
          </p>
        </section>

        <section className="bg-[#111132] p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">Our Mission</h2>
          <p className="text-gray-300">
            We aim to revolutionize the way you take and manage notes. Whether you're a student, professional, or creative thinker, our goal is to provide you with a seamless experience to store, search, and simplify your notes—anytime, anywhere.
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;
