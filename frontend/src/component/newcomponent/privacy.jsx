import React from 'react';

const PrivacyPolicy = () => {
  // Store privacy policy data in a variable
  const privacyPolicyData = [
    {
      id: 1,
      title: "1. Information We Collect",
      content: "We may collect personal information, such as your name, contact details, and preferences, when you interact with our website or make a design selection. This information is used to fulfill your orders, provide personalized services, and enhance your overall experience.",
    },
    {
      id: 2,
      title: "2. How We Use Your Information",
      content: "Your information is used for order processing, personalized communication, and to improve our products and services. We do not sell, trade, or transfer your personally identifiable information to outside parties without your consent.",
    },
    {
      id: 3,
      title: "3. Security Measures",
      content: "Puramente International employs industry-standard security measures to safeguard your personal information. We use secure servers and regularly update our protocols to protect against unauthorized access, disclosure, or alteration of your information.",
    },
    {
      id: 4,
      title: "4. Cookies and Tracking",
      content: "Our website uses cookies to enhance your browsing experience. These cookies are small data files stored on your device that help us analyze website traffic and tailor our services to your preferences. You can choose to accept or decline cookies through your browser settings.",
    },
    {
      id: 5,
      title: "5. Third-Party Links",
      content: "Our website may contain links to external sites. Please note that we are not responsible for the privacy practices of these third-party websites. We encourage you to review their privacy policies before providing any personal information.",
    },
    {
      id: 6,
      title: "6. Updates to Privacy Policy",
      content: "Puramente International reserves the right to update this Privacy Policy periodically. Any changes will be reflected on this page. We recommend checking this page regularly to stay informed about our privacy practices.",
    },
    {
      id: 7,
      title: "7. Your Consent",
      content: "By using our website, you consent to the terms outlined in this Privacy Policy. If you have any concerns or questions regarding the handling of your personal information, please contact us.",
    },
    {
      id: 8,
      title: "8. Contact Us",
      content: "For inquiries regarding our Privacy Policy, please contact us at info@puramenteinternational.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-cyan-200 to-white font-sans overflow-x-hidden">
      {/* Header with Animation */}
      <header className="bg-background-sky text-cyan-900 p-6 shadow-lg transform transition-all duration-300 hover:shadow-2xl">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight animate-fadeIn">Privacy Policy</h1>
          <p className="mt-3 text-cyan-800 text-lg animate-slideUp">
            Your privacy is our priority at Puramente International.
          </p>
        </div>
      </header>

      {/* Main Content with Enhanced Styling */}
      <main className="container mx-auto p-6 py-12 space-y-10">
        <section className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-cyan-500 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
          <h2 className="text-3xl font-bold text-cyan-700 mb-6">Welcome to Puramente International’s Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            This page outlines our commitment to ensuring the privacy and security of your personal information when you use our website. Please take a moment to review the following details:
          </p>
        </section>

        {/* Map through privacy policy sections with Icons and Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {privacyPolicyData.map((section) => (
            <section 
              key={section.id} 
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-cyan-400 transform transition-all duration-300 hover:scale-102 hover:shadow-xl cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-cyan-700 mb-4 flex items-center">
                <span className="mr-2 text-cyan-500">🔒</span> {/* Icon Placeholder */}
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Thank You Note with Gradient Background */}
        <section className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white p-8 rounded-xl shadow-2xl text-center transform transition-all duration-300 hover:scale-105">
          <p className="text-xl font-medium">
            Thank you for trusting Puramente International. Your privacy is important to us, and we are dedicated to maintaining the confidentiality and security of your information.
          </p>
          <p className="mt-4 text-sm text-cyan-100">
            Last updated: November 20, 2024
          </p>
        </section>
      </main>

      {/* Sticky Footer with Animation */}
      <footer className="bg-cyan-200 text-cyan-900 p-6 text-center shadow-inner fixed bottom-0 w-full">
        <p className="text-lg font-medium animate-bounce">© 2023 Puramente International. All rights reserved.</p>
      </footer>
    </div>
  );
};

// CSS for animations (you can move this to a separate CSS file or use Tailwind plugins)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-fadeIn { animation: fadeIn 1s ease-in; }
  .animate-slideUp { animation: slideUp 1s ease-out; }
  .animate-bounce { animation: bounce 2s infinite; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

export default PrivacyPolicy;