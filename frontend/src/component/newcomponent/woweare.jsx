import React from "react";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const WhoWeAre = () => {
  return (
    <section className="bg-gradient-to-br from-cyan-50 via-gray-50 to-cyan-100 py-20">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left animate-fade-in">
          <h3 className="text-sm uppercase tracking-widest text-cyan-600 font-medium mb-4">
            Who We Are
          </h3>
          <h1 className="text-4xl lg:text-5xl font-serif font-extrabold  leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 to-cyan-400">
            Crafting Timeless <br /> Gemstone Masterpieces <br /> in India
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
           
Experience the art of bespoke jewelry with our handcrafted gemstone collection, blending tradition With our fashionable gemstone collection.
          </p>
          <Link
            to="/contactus"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-400 text-white font-medium rounded-full hover:from-cyan-700 hover:to-cyan-500 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Get in Touch
          </Link>
        </div>

        {/* Right Column: Image */}
        <div className="lg:w-1/2 relative group">
          <div className="relative overflow-hidden rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
            <img
              src="/craft.jpg"
              alt="Jewelry Craftsmanship"
              className="w-full h-auto object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

            <div className="absolute bottom-4 left-4 text-white text-sm font-serif italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Handcrafted Perfection
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
