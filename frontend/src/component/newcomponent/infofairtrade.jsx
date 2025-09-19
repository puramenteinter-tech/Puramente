import React from "react";
import { Link } from "react-router-dom";

const InfoFairTrade = () => {
  // Data for Fair Trade principles with a cyan theme
  const fairTradePrinciples = [
    {
      title: "Empower, Uplift, Prosper",
      description:
        "Create opportunities for producers to thrive and grow with dignity.",
      imageAlt: "Empowered women in vibrant communities",
      imageUrl:
        "/uplift.jpg",
      icon: "🌱",
    },
    {
      title: "Financial Support",
      description:
        "Providing resources to ensure sustainable growth and stability for producers.",
      imageAlt: "Hands exchanging resources",
      imageUrl:
        "/finacesupport.jpg",
      icon: "💰",
    },
    {
      title: "Transparency & Accountability",
      description: "Building trust through clear and honest financial practices.",
      imageAlt: "Transparent business handshake",
      imageUrl:
        "/accountability.jpg",
      icon: "🔍",
    },
    {
      title: "Equality, Equity, and Freedom",
      description:
        "Fostering inclusivity and justice for all in the trade ecosystem.",
      imageAlt: "Diverse team collaborating",
      imageUrl:
        "/equality.jpg",
      icon: "🤝",
    },
    {
      title: "Good Working Conditions",
      description:
        "Guaranteeing safe, healthy, and fair workplaces for everyone involved.",
      imageAlt: "Clean and safe work environment",
      imageUrl:
        "/goodworkingconditions.jpg",
      icon: "🏭",
    },
    {
      title: "Respect for the Environment",
      description: "Committing to sustainable practices that protect our planet.",
      imageAlt: "Lush green fields and sustainable farming",
      imageUrl:
        "/respectforearth.jpg",
      icon: "🌍",
    },
  ];

  return (
    <div className="container mx-auto px-3 py-12 bg-gradient-to-br from-cyan-100 to-cyan-50">
      {/* Changed background to a softer cyan gradient */}
      {/* Hero Section with Animation */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-800 mb-3 drop-shadow-md">
          Our Passion for Fair Trade
        </h1>
        <p className="text-cyan-700 max-w-xl mx-auto text-sm md:text-base leading-tight">
          We’re dedicated to a sustainable future, empowering producers, and
          fostering ethical practices. Discover our vibrant mission!
        </p>
      </div>

      {/* Cards Section with Staggered Layout and Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fairTradePrinciples.map((principle, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-lg hover:bg-cyan-100 border-l-2 border-cyan-400 ${
              index % 2 === 0 ? "border-cyan-500" : "border-cyan-300"
            } animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s`, minHeight: "350px" }}
          >
            <div className="p-3 flex flex-col h-full">
              <div className="flex items-center mb-2">
                <span className="text-xl md:text-2xl mr-2 text-cyan-600">
                  {principle.icon}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-cyan-800 truncate">
                  {principle.title}
                </h3>
              </div>
              <p className="text-cyan-700 mb-3 leading-tight line-clamp-2">
                {principle.description}
              </p>
              <img
                src={principle.imageUrl}
                alt={principle.imageAlt}
                className="w-full h-32 md:h-52 object-cover rounded border border-cyan-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300";
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Creative Call to Action with Animation */}
      <div className="mt-10 text-center animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-800 mb-3 drop-shadow-lg">
          Be Part of the Change
        </h2>
        <p className="text-cyan-700 mb-4 max-w-md mx-auto text-sm md:text-base leading-tight">
          Join our movement to create a fairer world. Explore ways to support
          and engage with our mission today!
        </p>
        <Link to="/contactus">
          <button className="bg-cyan-600 text-white px-6 md:px-8 py-1.5 md:py-2 rounded-lg hover:bg-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 animate-bounce-slow">
            Get Involved Now
          </button>
        </Link>
      </div>
    </div>
  );
};

// CSS Animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .animate-fade-in { animation: fadeIn 0.6s ease-out; }
  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
  .animate-slide-up { animation: slideUp 0.5s ease-out; }
  .animate-bounce-slow { animation: bounceSlow 2s infinite; }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default InfoFairTrade;