import React from "react";
import { Mail, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const HelpSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-100 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute bottom-0 w-full h-1/3 text-cyan-200"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.6"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,245.3C960,224,1056,160,1152,149.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-full h-1/2 text-cyan-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            fillOpacity="0.4"
            d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,149.3C672,160,768,224,864,229.3C960,235,1056,181,1152,154.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-800 mb-4 tracking-tight">
            Need More Help?
          </h1>
          <p className="text-xl text-cyan-600 max-w-2xl mx-auto">
            Have questions or inquiries? Our team is here to provide the answers
            and solutions you seek.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-full max-w-sm shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 to-cyan-400/20 rounded-2xl"></div>
            <div className="relative flex flex-col items-center text-center">
              <Mail className="w-14 h-14 text-cyan-600 mb-4" />
              <h2 className="text-3xl font-bold text-cyan-800 mb-3">
                Contact Us
              </h2>
              <p className="text-cyan-700 mb-6">
                Feel free to customize it to better suit your brand’s messaging
                and tone.
              </p>
              <Link
                to="/contactus"
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Contact Now
              </Link>
            </div>
          </div>

          <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 w-full max-w-sm shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 to-cyan-400/20 rounded-2xl"></div>
            <div className="relative flex flex-col items-center text-center">
              <BookOpen className="w-14 h-14 text-cyan-600 mb-4" />
              <h2 className="text-3xl font-bold text-cyan-800 mb-3">
                About Us
              </h2>
              <p className="text-cyan-700 mb-6">
                Stay updated with the latest trends, jewelry tips, insights.
              </p>
              <Link to="/aboutus">
                <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                  Read Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
