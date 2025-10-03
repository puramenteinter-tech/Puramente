import React from "react";

const VideoSection = () => {
  const handlePlayVideo = () => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    }
  };

  return (
    <section className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-cyan-400">
          Watch Our Video
        </h2>
        <div
          className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-lg overflow-hidden shadow-lg cursor-pointer"
          onClick={handlePlayVideo}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/VQ0yrr-pPhE?t=1&controls=1&rel=0"
            title="Company Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;