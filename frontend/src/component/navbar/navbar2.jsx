import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { IsAdmin } from "../authantication/isauthanticat";
import { AiFillInstagram } from "react-icons/ai";
import { ChevronDown } from "lucide-react";

export default function Navbar2() {
  const categories = [
    {
      name: "Necklace",
      category: "Necklaces",
      subcategories: [
        { name: "With Gemstone", path: "withgemstone" },
        { name: "Without Gemstone", path: "withoutgemstone" },
      ],
    },
    {
      name: "Earring",
      category: "Earrings",
      subcategories: [
        { name: "With Gemstone", path: "withgemstone" },
        { name: "Without Gemstone", path: "withoutgemstone" },
      ],
    },
    {
      name: "Bracelet",
      category: "Bracelets",
      subcategories: [
        { name: "With Gemstone", path: "withgemstone" },
        { name: "Without Gemstone", path: "withoutgemstone" },
      ],
    },
    {
      name: "Ring",
      category: "Rings",
      subcategories: [
        { name: "With Gemstone", path: "withgemstone" },
        { name: "Without Gemstone", path: "withoutgemstone" },
      ],
    },
    {
      name: "Pendant",
      category: "Pendants",
      subcategories: [
        { name: "With Gemstone", path: "withgemstone" },
        { name: "Without Gemstone", path: "withoutgemstone" },
      ],
    },
  ];

  const [dropdown, setDropdown] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      <nav className="relative hidden lg:flex gap-8 items-center h-16 w-full">
        <div className="text-button-orange flex justify-between items-center px-24 w-full gap-10 p-2 text-lg font-bold">
          <Link
            onMouseEnter={() => setDropdown(false)}
            className="hover:text-cyan-600"
            to="/"
          >
            {t("Home")}
          </Link>

          <Link
            onMouseEnter={() => setDropdown(false)}
            className="hover:text-cyan-600"
            to="/aboutus"
          >
            {t("About us")}
          </Link>

          {/* Jewellery Design Dropdown */}
          <div className="relative" onMouseEnter={() => setDropdown(true)}>
            <div className="hover:text-cyan-600 flex items-center cursor-pointer">
              Jewellery Design
              <ChevronDown />
            </div>
            {dropdown && (
              <ul
                onMouseLeave={() => setDropdown(false)}
                className="absolute z-50 left-0 mt-2 w-56 bg-white shadow-lg rounded-md"
              >
                {/* ✅ All Designs Option */}
                <li className="relative">
                  <Link
                    to="/category/alldesigns"
                    className="flex justify-between items-center px-4 py-2 hover:bg-cyan-100 text-black font-semibold"
                  >
                    All Designs
                  </Link>
                </li>

                {/* ✅ Rest Categories */}
                {categories.map((item) => (
                  <li key={item.category} className="relative group">
                    <Link
                      to={`/category/${item.name}`}
                      className="flex justify-between items-center px-4 py-2 hover:bg-cyan-100 text-black"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Link>

                    {/* Subcategories */}
                    <ul className="absolute top-0 left-full hidden group-hover:block bg-white border shadow-lg rounded-md w-56 z-50">
                      {item.subcategories.map((sub) => (
                        <li key={sub.path}>
                          <Link
                            to={`/category/${item.category}/${sub.path}`}
                            className="block px-4 py-2 hover:bg-cyan-100 text-black"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            onMouseEnter={() => setDropdown(false)}
            className="hover:text-cyan-600"
            to="/fairtrade"
          >
            Fair Trade Practicing
          </Link>

          <Link
            onMouseEnter={() => setDropdown(false)}
            className="hover:text-cyan-600"
            to="/contactus"
          >
            {t("Contact us")}
          </Link>

          {IsAdmin() ? (
            <Link className="text-center text-lg" to="/dashboard">
              <button className="bg-cyan-500 hover:bg-cyan-800 h-8 w-28 border-2 border-cyan-800 text-white">
                {t("Dashboard")}
              </button>
            </Link>
          ) : (
            <div className="flex gap-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/puramenteinternational/"
              >
                <AiFillInstagram className="h-6 hover:text-cyan-500 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/puramenteinternational1/"
              >
                <FaFacebook className="h-6 hover:text-cyan-500 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@puramenteinternational1982"
              >
                <FaYoutube className="h-6 hover:text-cyan-500 w-8" />
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
