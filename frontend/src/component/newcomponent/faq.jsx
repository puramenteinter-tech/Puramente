import React, { useState } from "react";
import { Link } from "react-router-dom";

function Faqsection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "What sets Puramente International apart as a jewelry manufacturer?",
      answer: "Puramente International stands out due to its commitment to craftsmanship, innovative designs, and sustainable practices. We blend traditional techniques with modern technology to create Unique and high quality fashion jewelry",
    },
    {
      question: "Do you offer customization for your jewelry designs?",
      answer: "Yes, we offer customization services! You can work with our design team to create personalized pieces tailored to your preferences.",
    },
    {
      question: "What types of materials do you use in your jewelry manufacturing?",
      answer: "We use a variety of high-quality materials including 925 sterling silver, gold, platinum, and ethically sourced gemstones to ensure durability and elegance.",
    },
    {
      question: "Can I purchase your jewelry as a wholesaler?",
      answer: "Yes, we work as jewelry wholesalers. We welcome wholesale inquiries! Please contact our sales team for more details and to discuss bulk order options.",
    },
    {
      question: "How can I visit your showroom to make jewelry selections?",
      answer: "We’d love to have you visit our showroom! Please contact our team to schedule an appointment, as our showroom operates by appointment only to ensure personalized service. Reach out via our contact form or call our office for more details.",
    },
    {
      question: "What plating options are available for your jewelry?",
      answer: "We offer a variety of plating options including rhodium, gold, rose gold, and silver plating, depending on the base material and design. Contact our design team to discuss the best option for your piece.",
    },
    {
      question: "How can I contact Puramente International for inquiries or orders?",
      answer: "You can reach us via our website contact form, email at  info@puramentejewel.com, or by phone at +91 9314 346 148. Our team is available to assist with inquiries and orders",
    },
    {
      question: "Is Puramente International committed to sustainable practices?",
      answer: "Yes, we are deeply committed to sustainability. We use ethically sourced materials, recycle metal scraps, and adhere to eco-friendly manufacturing processes to minimize our environmental impact.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-white flex items-center justify-center py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8 lg:py-12 lg:px-10 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%2300BCD4\' stroke-width=\'1\' opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-50"></div>

      {/* Decorative Wave Header with Animation */}
      <div className="absolute top-0 w-full h-24 sm:h-28 md:h-32 lg:h-36 bg-cyan-500 animate-wave">
        <svg
          className="w-full h-full text-white"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#00BCD4"
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,117.3C672,96,768,96,864,106.7C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      <div className="max-w-5xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center bg-cyan">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-800 mb-2 sm:mb-3 drop-shadow-md">
            Frequently Asked Questions
          </h1>
          <div className="w-16 sm:w-20 h-1 sm:h-2 bg-cyan-600 mx-auto rounded-full"></div>
          
        </div>

        {/* Search Bar */}
        <div className="text-center">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-3 rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-cyan-800 placeholder-cyan-400"
            aria-label="Search FAQs"
          />
        </div>

        {/* FAQ Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-cyan-600"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left py-3 sm:py-4 px-3 sm:px-4 flex justify-between items-center hover:bg-cyan-50/80 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="text-base sm:text-lg md:text-xl font-semibold text-cyan-900">
                  {faq.question}
                </span>
                <span className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center bg-cyan-100 text-cyan-700 rounded-full transform transition-transform duration-300">
                  {openIndex === index ? '-' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div
                  id={`faq-${index}`}
                  className="py-3 sm:py-4 px-3 sm:px-4 text-gray-800 bg-cyan-50/80 rounded-b-lg animate-fadeIn"
                >
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section with Button */}
        <div className="text-center text-cyan-700 mt-6 sm:mt-8">
          <p className="text-base sm:text-lg mb-2">
            Still have questions?{' '}
            <Link
              to="contactus"
              className="font-semibold hover:text-cyan-900 transition-colors duration-300 underline underline-offset-4"
            >
              Contact our support team
            </Link>
          </p>
         
        </div>
      </div>
    </div>
  );
}

// CSS for animations
const styles = `
  @keyframes wave {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  .animate-wave {
    animation: wave 4s ease-in-out infinite;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Faqsection;