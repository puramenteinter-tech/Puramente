import { Link } from "react-router-dom";
const InfoCards = () => {
  const cards = [
    {
      icon: (
        <svg
          className="w-12 h-12 text-cyan-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5m4-4h6"
          />
        </svg>
      ),
      title: "Jewelry Designs",
      description:
        "Uncover stunning jewelry that fuses timeless elegance with innovative craftsmanship, crafted to enchant.",
      page: "/shopall",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-cyan-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10v13m6-10v10m5.447-7.724A1 1 0 0021 5.618v10.764a1 1 0 01-1.447.894L15 14"
          />
        </svg>
      ),
      title: "About Us",
      description:
        "We are dedicated craftsmen weaving narratives through jewelry, merging tradition with creativity.",
      page: "/aboutus",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-cyan-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 9.143l-5.714 2.714L13 21l-2.286-6.857L5 11.143l5.714-2.714L13 3z"
          />
        </svg>
      ),
      title: "Fair Trade",
      description:
        "Fair trade is a social and economic movement aimed at ensuring ethical and sustainable practices in global trade.",
      page: "/fairtrade",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-cyan-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
      title: "Visit Jaipur",
      description:
        "Start your exquisite journey from jaipur jewelry manufactures , where rich heritage and  master craftsmanship create an unforgettable experience",
      page: "/visitjaipur",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-cyan-200 to-cyan-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-cyan-900 mb-10 sm:mb-12 drop-shadow-lg">
          Explore More
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card, index) => (
            <Link to={card.page} >
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl bg-white/80 backdrop-blur-md border border-cyan-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Glassmorphism Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-teal-200/50 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Card Content */}
              <div className="relative z-10 p-6 text-center">
                <div className="flex justify-center mb-5">
                  <div className="p-4 bg-cyan-100 rounded-full shadow-md">
                    {card.icon}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-cyan-800 mb-3 group-hover:text-cyan-900 transition-colors duration-300">
                  {card.title}
                </h3>

                <p className="text-gray-700 line-clamp-4 text-sm sm:text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {card.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-cyan-400/10 blur-md scale-95 group-hover:scale-100 transition-transform duration-300"></div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-teal-500"></div>
            </div></Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoCards;
