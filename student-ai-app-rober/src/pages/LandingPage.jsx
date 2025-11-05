import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function Landing() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-bfrom-blue-800 via-gray-400 to-gray-200 flex flex-col">
      
      {/* HEADER */}
      <header className="w-full fixed top-0 left-0 z-20 bg-white/70 backdrop-blur-md shadow-md py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <span className="text-lg md:text-xl font-bold text-green-400">
            COLLEGE OF COMPUTER STUDIES
          </span>
        </div>

        <nav className="flex gap-4">
          <button
            onClick={() => handleNavigation("/students")}
            className="px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-gray-700"
          >
            Students
          </button>
          <button
            onClick={() => handleNavigation("/subjects")}
            className="px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-gray-700"
          >
            Subjects
          </button>
          <button
            onClick={() => handleNavigation("/grades")}
            className="px-4 py-2 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-gray-700"
          >
            Grades
          </button>
        </nav>
      </header>

      {/* MAIN SECTION */}
      <main className="flex flex-1 items-center justify-center pt-24 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
          <div className="relative md:w-1/3 w-full">
            <div className="absolute inset-0 blur-3xl bg-indigo-200 opacity-40 rounded-full -z-10"></div>
            <img
              src="/photo.jpg"
              alt="Profile"
              className="w-64 h-64 mx-auto md:mx-0 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
            />
          </div>

          <div className="md:w-2/3 w-full text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-gray-700 mb-4">
              Niña Mae Rober
            </h1>
            <p className="text-blue-400 text-xl font-semibold mb-6">
              Bachelor of Science in Information Technology
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              My journey as an IT student since my first year has been filled with curiosity, learning, and growth. 
              From the moment I was introduced to the fundamentals of programming, I developed a strong interest in how 
              technology shapes the modern world. As I explored different areas such as web development and system design, 
              I faced challenges that tested my patience and determination. Each experience — from writing my first program 
              to completing complex projects — strengthened my creativity and problem-solving skills. Over time, I’ve grown not 
              just as a student but as a future innovator who aims to use technology to inspire others and create meaningful change.
            </p>

            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              <button
                onClick={() => handleNavigation("/students")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition duration-300"
              >
                🎓 Students
              </button>
              <button
                onClick={() => handleNavigation("/subjects")}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg transition duration-300"
              >
                📘 Subjects
              </button>
              <button
                onClick={() => handleNavigation("/grades")}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition duration-300"
              >
                📊 Grades
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/60 backdrop-blur-md text-gray-600 text-center py-6 mt-auto">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-600">Niña Mae Rober</span> — BSIT
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-indigo-600 transition">GeminiAI</a>
          <a href="#" className="hover:text-indigo-600 transition">GitHub</a>
          <a href="#" className="hover:text-indigo-600 transition">ReactJS</a>
        </div>
      </footer>
    </div>
  );
}
