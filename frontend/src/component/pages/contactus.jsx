import { LocateIcon, Mail, MapPin, PhoneCall } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BaseURL from "../../baseurl";
import Select from "react-select";
import { FlagIcon } from "react-flag-kit"; // Alternative to react-country-flag
import { FaLocationArrow } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";

const countryOptions = [
  { value: "US", label: "United States", flag: "US" },
  { value: "IN", label: "India", flag: "IN" },
  { value: "GB", label: "United Kingdom", flag: "GB" },
  { value: "CA", label: "Canada", flag: "CA" },
  { value: "AU", label: "Australia", flag: "AU" },
  { value: "DE", label: "Germany", flag: "DE" },
  { value: "FR", label: "France", flag: "FR" },
  { value: "IT", label: "Italy", flag: "IT" },
  { value: "ES", label: "Spain", flag: "ES" },
  { value: "JP", label: "Japan", flag: "JP" },
  { value: "BR", label: "Brazil", flag: "BR" },
  { value: "CN", label: "China", flag: "CN" },
  { value: "RU", label: "Russia", flag: "RU" },
  { value: "ZA", label: "South Africa", flag: "ZA" },
  { value: "MX", label: "Mexico", flag: "MX" },
  { value: "KR", label: "South Korea", flag: "KR" },
  { value: "SG", label: "Singapore", flag: "SG" },
  { value: "CH", label: "Switzerland", flag: "CH" },
  { value: "AT", label: "Austria", flag: "AT" },
  { value: "PT", label: "Portugal", flag: "PT" },
  { value: "DK", label: "Denmark", flag: "DK" },
  { value: "SE", label: "Sweden", flag: "SE" },
  { value: "AR", label: "Argentina", flag: "AR" },
  { value: "NO", label: "Norway", flag: "NO" },
  { value: "NZ", label: "New Zealand", flag: "NZ" },
  { value: "NL", label: "Netherlands", flag: "NL" },
  { value: "TR", label: "Turkey", flag: "TR" },
  { value: "IL", label: "Israel", flag: "IL" },
  { value: "PL", label: "Poland", flag: "PL" },
  { value: "RO", label: "Romania", flag: "RO" },
  { value: "GR", label: "Greece", flag: "GR" },
  { value: "HU", label: "Hungary", flag: "HU" },
  { value: "IE", label: "Ireland", flag: "IE" },
  { value: "LT", label: "Lithuania", flag: "LT" },
  { value: "LU", label: "Luxembourg", flag: "LU" },
  { value: "MC", label: "Monaco", flag: "MC" },
];

export default function Contactus() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [contactdata, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    contactNumber: "", // New field
    companyName: "", // New field
    country: "", // New field
    companyWebsite: "", // New field
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BaseURL}/api/contact/send`, contactdata);
      setContactData({
        name: "",
        email: "",
        message: "",
        contactNumber: "",
        companyName: "",
        country: "",
        companyWebsite: "",
      });
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Email send failed:", error);
    }
  };

  const handleContactData = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactdata, [name]: value });
  };

  const handleCountryChange = (selectedOption) => {
    setContactData({
      ...contactdata,
      country: selectedOption ? selectedOption.label : "",
    });
  };

  return (
      <>
      <Helmet>
        <title>Contact Puramente Jewel | Jewelry Experts</title>
        <meta
          name="description"
          content="Get in touch with Puramente Jewel International for inquiries, orders, and support. Serving customers in France, UK, USA & across Europe."
        />
        <meta
          name="keywords"
          content="Contact Puramente Jewel, Jewelry Support, Jewelry Inquiries Europe"
        />
        <link rel="canonical" href="https://puramentejewel.com/contactus" />
      </Helmet>

      <h1  className="text-center text-4xl font-bold text-gray-800 mt-8 mb-6 capitalize">Contact Puramente Jewel</h1>
      {/* Rest of Contact Us page */}
    
    <div>
      {showPopup && (
        <div
          className="fixed h-44 w-[50rem] top-1/2 left-1/2 bg-opacity-50 bg-cyan-200 flex justify-center items-center z-50"
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 999,
          }}
        >
          <div>
            <h2 className="text-lg font-semibold text-center">
              {t("Thanks for reaching out! We’ll get back to you soon.")}
            </h2>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {t("Contact Us")}
                </h2>

                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Your Name")}
                  </label>
                  <input
                    type="text"
                    onChange={handleContactData}
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("enter name")}
                    value={contactdata.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    onChange={handleContactData}
                    name="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("enter_email")}
                    value={contactdata.email}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Contact Number")}
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    onChange={handleContactData}
                    name="contactNumber"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("Enter contact number")}
                    value={contactdata.contactNumber}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Company Name")}
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    onChange={handleContactData}
                    name="companyName"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("Enter company name")}
                    value={contactdata.companyName}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("country")}
                  </label>
                  <Select
                    id="country"
                    options={countryOptions}
                    onChange={handleCountryChange}
                    getOptionLabel={(option) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FlagIcon
                          code={option.flag}
                          size={24}
                          style={{ marginRight: 8 }}
                        />
                        {option.label}
                      </div>
                    )}
                    getOptionValue={(option) => option.value}
                    placeholder={t("Select Country")}
                    value={countryOptions.find(
                      (option) => option.value === contactdata.country
                    )}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="companyWebsite"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("Company Website")}
                  </label>
                  <input
                    type="url"
                    id="companyWebsite"
                    onChange={handleContactData}
                    name="companyWebsite"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("Enter Company Website")}
                    value={contactdata.companyWebsite}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    onChange={handleContactData}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder={t("enter_message")}
                    value={contactdata.message}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-background-sky text-white px-6 py-3 rounded-lg hover:bg-button-hover"
                >
                  {t("send_message")}
                </button>
              </form>
            </div>

            <div className="space-y-12 grid-cols-1">
              <div className="bg-white lg:h-96 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <PhoneCall className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("call_us")}
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  +91 9314 346 148
                </p>
                <div className="p-4 mt-8 bg-gray-100 rounded-full mb-4">
                  <Mail className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("write_to_us")}
                </h3>
                <p className="text-gray-600 font-medium text-lg">
                  info@puramentejewel.com
                </p>
              </div>
              <div>
                <img src="/contactus2.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Store Section */}
      <div className="w-full items-center gap-10 lg:gap-0 flex flex-col lg:flex-row h-screen">
        <div className="lg:w-1/2 h-1/2 lg:h-screen border">
          <img
            src="/puramentestore.jpeg"
            alt="store"
            className="w-full h-full"
          />
        </div>
        <div className="lg:w-1/2 flex items-center flex-col">
          <h1 className="text-3xl text-black font-bold">
            Visit Our Store
          </h1>
        
          
          <p className="m-12 flex flex-col justify-center items-center gap-4 text-center text-xl font-semibold text-black">
              <h1><MapPin size={40}/></h1>

           Address: 83/1 Ground Floor, Chetak Marg, Sector 8, Pratap Nagar, Jaipur-302033
          </p>
          <p className="lg:text-xl text-center font-semibold text-black">
            {t("phone")}: +91 9314 346 148
          </p>
          <p className="lg:text-xl text-center font-semibold text-black">{t("timings")}</p>
        </div>
      </div>
    </div>
    </>
  );
}
