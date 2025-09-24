import { useEffect, useRef } from "react";

export default function VideoTestimonials() {
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, []);

  const setRef = (el, idx) => {
    videoRefs.current[idx] = el;
  };

  const items = [
    {
      src: "/videos/testimonial1.mp4",
      poster: "/videos/poster1.jpg",
      name: "Elena, UK",
      quote: "Beautiful craftsmanship and reliable wholesale partner!",
    },
    {
      src: "/videos/testimonial2.mp4",
      poster: "/videos/poster2.jpg",
      name: "Michael, Canada",
      quote: "Top quality designs at fair pricing.",
    },
    {
      src: "/videos/testimonial3.mp4",
      poster: "/videos/poster3.jpg",
      name: "Aisha, UAE",
      quote: "Elegant pieces and timely delivery.",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-4">
              <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-black">
                <video
                  ref={(el) => setRef(el, idx)}
                  src={item.src}
                  poster={item.poster}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="font-semibold text-cyan-900">{item.name}</p>
                <p className="text-sm text-gray-600">“{item.quote}”</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

