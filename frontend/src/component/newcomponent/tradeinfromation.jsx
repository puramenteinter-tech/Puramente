import { useEffect } from "react";
import { 
  Key, Calculator, Handshake, DollarSign, User, 
  Users, ThumbsUp, BarChart2, Leaf, Home 
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const principles = [
  {
    icon: <Key className="w-8 h-8" />,
    text: "Create Opportunities for Economically Disadvantaged Producers",
  },
  {
    icon: <Calculator className="w-8 h-8" />,
    text: "Transparency & Accountability",
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    text: "Fair Trade Practices",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    text: "Fair Payment",
  },
  {
    icon: <User className="w-8 h-8" />,
    text: "No Child Labour, No Forced Labour",
  },
  {
    icon: <Users className="w-8 h-8" />,
    text: "No Discrimination, Gender Equity, Freedom of Association",
  },
  {
    icon: <ThumbsUp className="w-8 h-8" />,
    text: "Good Working Conditions",
  },
  {
    icon: <BarChart2 className="w-8 h-8" />,
    text: "Capacity Building",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    text: "Respect for the Environment",
  },
  {
    icon: <Home className="w-8 h-8" />,
    text: "Community Development",
  },
];

export default function FairTradePrinciples() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cyan-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-cyan-200 rounded-full opacity-10 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-300 rounded-full opacity-10 translate-x-1/3 -translate-y-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-900 mb-4">
            Fair Trade Principles
          </h2>
          <p className="text-cyan-700 text-base sm:text-lg max-w-2xl mx-auto">
            Building a sustainable and equitable future through ethical practices
          </p>
        </div>

        {/* Grid - Changed to lg:grid-cols-5 for 5 columns on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {principles.map((principle, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative p-6 rounded-xl bg-white border border-cyan-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Card Content */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-cyan-100 text-cyan-600 group-hover:bg-cyan-200 group-hover:scale-110 transition-all duration-300">
                  {principle.icon}
                </div>
                <p className="text-sm sm:text-base font-medium text-cyan-800 leading-tight">
                  {principle.text}
                </p>
              </div>

              {/* Hover Effects */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}