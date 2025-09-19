import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../loader/loader";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import BaseURL from "../../baseurl";
import Select from "react-select";
import { FlagIcon } from "react-flag-kit";

AOS.init();

export default function Signup() {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    country: "",
    companyName: "", // Updated to camelCase
    companyWebsite: "", // Updated to camelCase
  });
  const [matchPassword, setMatchPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCountryChange = (selectedOption) => {
    setCredentials({
      ...credentials,
      country: selectedOption ? selectedOption.value : "",
    });
    setTouched((prev) => ({ ...prev, companyName: true }));
  };

  const validateForm = () => {
    const errors = {};
    if (!credentials.name) errors.name = t("name_required");
    if (!credentials.email) {
      errors.email = t("email_required");
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = t("invalid_email");
    }
    if (!credentials.password) errors.password = t("password_required");
    if (!matchPassword) errors.matchPassword = t("confirm_password_required");
    if (matchPassword && matchPassword !== credentials.password) {
      errors.matchPassword = t("password_mismatch");
    }
    if (!credentials.contactNumber) errors.contactNumber = t("contact_required");
    if (!credentials.country) errors.country = t("country_required");
    // Removed validation for companyName and companyWebsite since they are now optional
if (
  credentials.companyWebsite &&
  !/^((https?:\/\/)?(www\.)?)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(credentials.companyWebsite)
) {
  errors.companyWebsite = t("invalid_website");
}

    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BaseURL}/api/users/register`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User Registered:", data);
      alert(t("signup_success"));

      setCredentials({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        country: "",
        companyName: "", // Updated to camelCase
        companyWebsite: "", // Updated to camelCase
      });
      setMatchPassword("");
      setTouched({});

      window.location.href = "/login";
    } catch (error) {
      setError(error.response?.data?.message || t("signup_failed"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center items-center h-[65vh]">
        <Loader />
      </div>
    );
  }

  const countryOptions = [
    { value: "US", label: "United States", flag: "US" },
    { value: "IN", label: "India", flag: "IN" },
    { value: "UK", label: "United Kingdom", flag: "GB" },
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
  ];

  return (
    <div className="bg-gray-50 w-full min-h-screen flex justify-center items-center p-4">
      <div
        data-aos="fade-down"
        data-aos-duration="600"
        className="w-full max-w-3xl bg-white flex flex-col lg:flex-row shadow-lg rounded-lg overflow-hidden"
      >
        <div className="lg:w-1/3 w-full h-32 lg:h-auto flex items-center justify-center bg-background-sky">
          <img
            className="w-32 h-16 lg:w-40 lg:h-24 animate-pulse"
            src="/userlogin.svg"
            alt="User"
          />
        </div>
        <form
          onSubmit={handleSignup}
          className="flex flex-col w-full lg:w-2/3 p-6 gap-4 justify-center items-center"
        >
          <h1 className="font-bold text-2xl mb-4">{t("signup")}</h1>

          <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("username_placeholder")} *
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  touched.name && !credentials.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="text"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                required
                placeholder={t("username_placeholder")}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email_placeholder")} *
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  touched.email && !credentials.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder={t("email_placeholder")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("password_placeholder")} *
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  touched.password && !credentials.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder={t("password_placeholder")}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("confirm_password_placeholder")} *
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  touched.matchPassword && !matchPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="password"
                value={matchPassword}
                onChange={(e) => setMatchPassword(e.target.value)}
                required
                placeholder={t("confirm_password_placeholder")}
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("Contact Number")} *
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  touched.contactNumber && !credentials.contactNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="tel"
                name="contactNumber"
                value={credentials.contactNumber}
                onChange={handleChange}
                required
                placeholder={t("Contact Number")}
              />
            </div>

            {/* Company Name (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("Company Name")} (Optional)
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent border-gray-300`} // Removed error styling
                type="text"
                name="companyName" // Updated to camelCase
                value={credentials.companyName} // Updated to camelCase
                onChange={handleChange}
                placeholder={t("Company Name")}
              />
            </div>

            {/* Company Website (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("Company Website")} (Optional)
              </label>
              <input
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent border-gray-300`} // Removed error styling
                type="url"
                name="companyWebsite" // Updated to camelCase
                value={credentials.companyWebsite} // Updated to camelCase
                onChange={handleChange}
                placeholder={t("Company Website")}
              />
            </div>

            {/* Country */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Country")} *
              </label>
              <Select
                options={countryOptions}
                onChange={handleCountryChange}
                getOptionLabel={(option) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FlagIcon
                      code={option.flag}
                      size={20}
                      style={{ marginRight: 6 }}
                    />
                    {option.label}
                  </div>
                )}
                getOptionValue={(option) => option.value}
                placeholder={t("Select Country")}
                value={countryOptions.find(
                  (option) => option.value === credentials.country
                )}
                required
                className={`w-full border rounded-md ${
                  touched.country && !credentials.country
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#ffffff",
                    borderColor:
                      touched.country && !credentials.country
                        ? "#ef4444"
                        : "#d1d5db",
                    borderRadius: "0.375rem",
                    padding: "0.125rem",
                    minHeight: "38px",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#ffffff",
                    borderRadius: "0.375rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }),
                  option: (base) => ({
                    ...base,
                    padding: "6px 12px",
                  }),
                }}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2 md:col-span-2">{error}</p>
            )}

            <button
              className="w-full md:col-span-2 bg-background-sky text-white p-2 rounded-md hover:bg-cyan-700 transition duration-200 font-semibold"
              type="submit"
            >
              {t("signup_button")}
            </button>

            <p className="text-sm text-gray-600 text-center md:col-span-2">
              {t("already_account")}{" "}
              <Link to="/login" className="font-bold hover:underline">
                {t("login")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}