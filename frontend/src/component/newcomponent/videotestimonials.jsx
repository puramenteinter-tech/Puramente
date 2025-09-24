import { useRef, useState } from "react";
// video files import top par karo
import test1 from "../../assets/test1.mp4";

export default function VideoTestimonials() {
  const videoRefs = useRef([]);
  const [mutedStates, setMutedStates] = useState({});

  const setRef = (el, idx) => {
    videoRefs.current[idx] = el;
    if (el && mutedStates[idx] === undefined) {
      setMutedStates((prev) => ({ ...prev, [idx]: true })); // default muted
      el.muted = true;
    }
  };

  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (video.paused) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  };

  const toggleMute = (idx) => {
    const video = videoRefs.current[idx];
    if (video) {
      video.muted = !video.muted;
      setMutedStates((prev) => ({ ...prev, [idx]: video.muted }));
    }
  };

  // items list ab imported videos use karega
  const items = [
    {
      src: test1,
      name: "Elena, UK",
      quote: "Beautiful craftsmanship and reliable wholesale partner!",
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-cyan-800">
          What Our Clients Say
        </h2>
        <p className="text-center text-cyan-700 mt-2 mb-8">
          Real video testimonials from our wholesale partners
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[9/13] bg-black group">
                <video
                  ref={(el) => setRef(el, idx)}
                  src={item.src}
                  className="w-full h-full object-cover"
                  muted
                  autoPlay
                  playsInline
                  loop
                  preload="auto"
                  onClick={() => handleVideoClick(idx)}
                />

                {/* Mute/Unmute Button per Video */}
                <button
                  onClick={() => toggleMute(idx)}
                  className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
                >
                  {mutedStates[idx] ? (
                    // Muted Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9v6h4l5 5V4l-5 5H9z"
                      />
                    </svg>
                  ) : (
                    // Unmuted Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 8.25l2.25 2.25m0 0L15 12.75m2.25-2.25H9m4.5 0a6 6 0 11-12 0 6 6 0 0112 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="font-semibold text-cyan-900">{item.name}</p>
                <p className="text-sm text-gray-600 mt-1">"{item.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
