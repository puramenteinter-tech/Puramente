import { Link } from "react-router-dom";
import React, { useState } from "react";

const Jewelryinfo = () => {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = {
    intro: {
      title: "Why Puramente International",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
          In the dazzling world of jewelry, where artistry meets craftsmanship, Puramente International shines as a beacon of excellence. As one of the most trusted imitation jewelry manufacturers of India ,we are your premiere destination for custom jewelry.
 and wholesale brass and 925 sterling silver pieces.

          </p>
          <p>
            Serving Jewelry Retailers, Brands, Designers, and Wholesalers worldwide, we invite you to embark on a sparkling journey with us!
          </p>
        </div>
      ),
      image: "/whypuramente.jpg",
    },
    welcome: {
      title: "Welcome to Your Jewelry Journey",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Whether you’re dreaming of entering the silver jewelry realm or
            scaling your existing business, you’ve found your perfect partner.
            Discovering the ideal manufacturer and wholesaler is a thrilling
            adventure.
          </p>
          <p>
            We provide more than a roadmap—we offer a blueprint for success with
            unique design suggestions to elevate your brand. Let’s create
            brilliance together!
          </p>
        </div>
      ),
      image: "https://res.cloudinary.com/dqibmkvib/image/upload/v1746783191/3_vtn0ff.jpg",
    },
    custom: {
      title: "Crafting Dreams: Custom Jewelry",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
           At Puramente International, jewelry is a canvas of art and emotion.Our custom jewelry manufacturing unit in India transforms your sketches and dreams into tangible treasures.
          </p>
          <p>
            With skilled artisans and a blend of handmade and casting techniques, we craft each piece with passion, turning your vision into timeless keepsakes.
          </p>
        </div>
      ),
      image: "https://res.cloudinary.com/dqibmkvib/image/upload/v1746782736/WhatsApp_Image_2025-05-09_at_14.01.43_7cf39cfc_gflmui.jpg",
    },
    materials: {
      title: "Unveiling the Sparkle: Our Materials",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-cyan-800 mb-2">
              Brass: Versatile Elegance
            </h3>
            <p className="text-gray-600 text-sm">
              With its warm, golden hue, our nickel-free, hypoallergenic brass
              offers intricate designs spanning vintage charm to modern
              sophistication.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-cyan-800 mb-2">
              925 Sterling Silver: Timeless Beauty
            </h3>
            <p className="text-gray-600 text-sm">
              Known as the “metal of the moon,” our sterling silver radiates a
              luminous glow, crafted into jewelry that echoes centuries of
              tradition.
            </p>
          </div>
        </div>
      ),
      image: "/boutique.jpg",
    },
    global: {
      title: "Our Global Network",
      content: (
        <p className="text-gray-600 leading-relaxed">
          From Milan to Marrakech, our reach spans the globe. We deliver quality
          and creativity, ensuring every piece reflects your brand and
          captivates customers worldwide.
        </p>
      ),
      image: "/globalnetwork.jpg",
    },
    exhibition: {
      title: "Exhibition Showcase",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "/exibetion2.jpg",
            "/exibetion5.jpg",
            "/exibetion6.jpg",
            // You can add more images here, but only the first 3 will display
          ]
            .slice(0, 3)
            .map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Exhibition ${idx + 1}`}
                className="w-full h-48 sm:h-56 mb-5 md:h-64 object-contain rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              />
            ))}
        </div>
      ),
      image: "/exibetion2.jpg", // Optional default image
    },
    
    

    conclusion: {
      title: "Crafted in india with precision",
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            In jewelry, the journey is as precious as the destination. As
            India’s premier manufacturer, our dedication to excellence and
            customization sets us apart.
          </p>
          <p>
            Retailers, brands, designers, and wholesalers—join us to bring your
            vision to life. Let’s craft a sparkling legacy together!
          </p>
        </div>
      ),
      image:
        "https://res.cloudinary.com/dqibmkvib/image/upload/v1747898205/Your_Journey_Begins_aj4j6i.jpg",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-300 to-cyan-600 flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-800 to-cyan-900 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Puramente International
          </h1>
          <p className="text-base sm:text-lg lg:text-xl mt-2 sm:mt-4 opacity-90 font-light">
            India's Finest Jewelry Manufacturer
          </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 gap-6 lg:gap-10">
        {/* Sidebar Navigation */}
        <aside className="md:w-1/4 bg-gradient-to-b from-cyan-50 to-cyan-200 rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-16 h-fit transition-transform duration-300 hover:scale-[1.01] md:hover:scale-[1.02]">
          <h2 className="text-xl sm:text-2xl font-semibold text-cyan-800 mb-4 sm:mb-6">
            Explore
          </h2>
          <nav className="space-y-2 sm:space-y-3">
            {Object.keys(sections).map((key, index) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium ${
                  activeSection === key
                    ? "bg-cyan-600 text-white shadow-md"
                    : "text-cyan-700 hover:bg-cyan-300 hover:text-cyan-900"
                }`}
              >
                {sections[key].title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4 bg-gradient-to-b from-cyan-50 to-cyan-200 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 animate-fade-in">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-800 mb-4 sm:mb-6 tracking-tight">
            {sections[activeSection].title}
          </h2>
          {sections[activeSection].content}
          {activeSection === "conclusion" && (
            <Link to="/contactus">
            <button className="mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-r from-cyan-600 to-cyan-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:from-cyan-700 hover:to-cyan-900 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
              Start Your Journey
            </button></Link>
          )}
          {sections[activeSection].image && (
            <img
              src={sections[activeSection].image}
              alt={sections[activeSection].title}
              className="w-full pt-5 h-48 sm:h-64 md:h-72 lg:h-96 rounded-lg shadow-md mb-4 sm:mb-6 object-contain"
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyan-900 to-cyan-800 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-lg font-light opacity-90">
            Puramente International - Where Craftsmanship Meets Creativity
          </p>
        </div>
      </footer>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Jewelryinfo;
