import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Isauthanticate, Logout } from "../authantication/isauthanticat";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-button-orange text-white">
      {/* Main Footer Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Contact Info */}
        <div>
          <h1 className="text-lg font-bold text-cyan-500 mb-3">CONTACT US</h1>
          <div className="text-sm space-y-2">
            <p>📍 83/1 Ground Floor, Chetak Marg, Sector 8, Pratap Nagar, Jaipur-302033</p>
            <p>📞 +91 9314 346 148</p>
            <p>✉ info@puramentejewel.com</p>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://www.instagram.com/puramenteinternational/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-500"
            >
              <AiFillInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.facebook.com/puramenteinternational1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-500"
            >
              <FaFacebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com/@puramenteinternational1982"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-500"
            >
              <FaYoutube className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/company/puramente-international/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-500"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h1 className="text-lg font-bold text-cyan-500 mb-3">{t("SERVICES")}</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/fairtrade" className="hover:text-cyan-500">Fair Trade Practicing</Link>
            <Link to="/contactus" className="hover:text-cyan-500">{t("Contact us")}</Link>
            <Link to="/visitjaipur" className="hover:text-cyan-500">Visit Us in Jaipur</Link>
          </div>
        </div>

        {/* My Account */}
        <div>
          <h1 className="text-lg font-bold text-cyan-500 mb-3">{t("MyAccount")}</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/privacy" className="hover:text-cyan-500">{t("Privacy")}</Link>
            <Link to="/cart" className="hover:text-cyan-500">{t("Checkout")}</Link>
            <Link to="/faq" className="hover:text-cyan-500">FAQ</Link>
            <Link to="/blogs" className="hover:text-cyan-500">Blog</Link>
   {Isauthanticate() ? (
  <p onClick={Logout} className="hover:text-cyan-500 cursor-pointer">
    Logout
  </p>
) : (
  <Link to="/login" className="hover:text-cyan-500">
    Login
  </Link>
)}


          </div>
        </div>

        {/* Categories */}
        <div>
          <h1 className="text-lg font-bold text-cyan-500 mb-3">{t("CATEGORIES")}</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/category/Rings" className="hover:text-cyan-500">{t("Rings")}</Link>
            <Link to="/category/Necklaces" className="hover:text-cyan-500">{t("Necklaces")}</Link>
            <Link to="/category/Bracelet" className="hover:text-cyan-500">{t("Bracelet")}</Link>
            <Link to="/category/Pendant" className="hover:text-cyan-500">{t("Pendant")}</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t border-white text-xs sm:text-sm"><a href="https://www.kontentkraftdigital.com/">
        © 2025 Puramente International — All Rights Reserved!  
        <br className="sm:hidden" />
        Developed By <span className="text-cyan-500">Kontent Kraft Digital</span>
        </a>
      </div>
    </footer>
  );
}
