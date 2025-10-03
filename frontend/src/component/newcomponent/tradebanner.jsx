import React from "react";

export default function TradeBanner() {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-cover bg-center overflow-hidden" 
      style={{ backgroundImage: "url('/puramente logo.png')" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/80 via-cyan-600/70 to-cyan-700/80 animate-pulse animate-subtlePulse"></div>
      <div className="relative z-10 text-center text-white px-6 md:px-12 py-8 bg-black/20 backdrop-blur-md rounded-xl shadow-2xl max-w-2xl mx-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3 animate-fadeInUp">
          <span className="bg-clip-text text-4xl text-transparent bg-gradient-to-r from-white to-cyan-300">Fair Trade Practicing</span>
        </h1>
        <p className="text-xl md:text-3xl font-light mt-2 text-white/90 animate-fadeInUp animation-delay-200">
          Supporting Fair Trade, Spreading Hope
        </p>
        <div className="mt-6 flex justify-center items-center gap-4">
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
          <img 
            src="/trade2.jpg" 
            alt="Floral Pattern" 
            className="w-36 rounded-full md:w-52 opacity-90 transform hover:scale-110 transition-transform duration-300" 
          />
          <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"></div>
        </div>
        
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}