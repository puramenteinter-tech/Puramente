import React from "react";
import { PhoneCall, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const VisitJaipur = () => {
  return (
    <div className="bg-cyan-100 min-h-screen py-10 px-5 md:px-20">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold text-cyan-800 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Visit Us in Jaipur
      </motion.h1>
      <p className="text-lg text-cyan-700 text-center max-w-3xl mx-auto mb-8">
        Uncover the Artistry, Experience the Elegance with Puramente International
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <img src="https://puramenteinternational.com/wp-content/uploads/2023/11/Palace-of-Wind-Hawa-Mahal-Jaipur-vintage-postcard.jpg" alt="Jaipur" className="w-full h-64 object-cover" />
          <div className="p-5">
            <h2 className="text-2xl font-semibold text-cyan-800">Explore the Artistry of Jaipur</h2>
            <p className="text-cyan-600 mt-2">
              Jaipur, the enchanting Pink City, is known for its rich heritage and exquisite craftsmanship. Immerse yourself in a world of fine jewelry.
            </p>
          </div>
        </div>

        <div className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <img src="https://puramenteinternational.com/wp-content/uploads/2023/11/ChgXLSxWgAE0Sx1.jpg" alt="Jewelry" className="w-full h-64 object-cover" />
          <div className="p-5">
            <h2 className="text-2xl font-semibold text-cyan-800">Witness Craftsmanship at its Finest</h2>
            <p className="text-cyan-600 mt-2">
              Puramente International showcases skilled artisans blending tradition with innovation to create stunning jewelry pieces using sterling silver and brass.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between bg-cyan-100 p-6 rounded-2xl mt-10 shadow-md">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-cyan-800">Plan Your Visit</h3>
          <p className="text-cyan-600">Experience Jaipur's jewelry excellence in person at our showroom in Sitapura.</p>
        </div>
        <button className="bg-cyan-700 text-white px-6 py-2 rounded-lg mt-4 md:mt-0 flex items-center">
          <PhoneCall className="mr-2" size={20} /> +91 9314346148
        </button>
      </div>

      <div className="text-center mt-10">
        <h3 className="text-2xl font-bold text-cyan-800">Contact Us</h3>
        <p className="text-cyan-600 mt-2">For inquiries, connect with us and start your journey into fine jewelry.</p>
        <Link to="/contactus" >
        <button className="bg-cyan-700 text-white px-6 py-2 rounded-lg mt-4 flex items-center mx-auto">
          <MapPin className="mr-2" size={20} /> Visit Us in Jaipur
        </button></Link>
      </div>
    </div>
  );
};

export default VisitJaipur;
