import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Isauthanticate, Logout } from "../authantication/isauthanticat";

export default function Footer() {
  const { t } = useTranslation(); // i18n hook
  return (
    <div className="bg-button-orange bottom-0">
      <div className="w-full flex gap-5 h-32 lg:h-56 text-white bg-button-orange">
        <div className="w-[40%] hidden lg:flex font-bold">
          <div className="mt-8 ml-8">
            <h1 className=" ml-4 text-lg lg:flex hidden text-cyan-500">
              CONTACT US
            </h1>

            <div className="mt-4 flex flex-col text-sm gap-2 text-white">
              <p className="hover:text-cyan-500">
                📍 Address: 83/1 Ground Floor, Chetak Marg, Sector 8, Pratap Nagar, Jaipur-302033
              </p>
              <p className="hover:text-cyan-500">📞 Phone: +91 9314 346 148</p>
              <p className="hover:text-cyan-500">
                ✉ Email: info@puramentejewel.com
              </p>
            </div>

            <div className="flex py-6 gap-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/puramenteinternational/"
                className="hover:text-cyan-500"
              >
                <AiFillInstagram className="h-6 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/puramenteinternational1/"
                className="hover:text-cyan-500"
              >
                <FaFacebook className="h-6 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@puramenteinternational1982"
                className="hover:text-cyan-500"
              >
                <FaYoutube className="h-6 w-8" />
              </a>
                <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/company/puramente-international/"
                className="hover:text-cyan-500"
              >
                <FaLinkedin className="h-6 w-8" />
              </a>
            </div>
          </div>
        </div>
        <div className="w-[60%] font-bold lg:flex hidden h-44 border-white">
          <div className="flex w-1/4 flex-col h-36 ml-10 mt-8 gap-2 items-start">
            <button className="text-lg text-cyan-500 hover:text-cyan-500">
              {t("SERVICES")}
            </button>
            <Link to="/fairtrade" className="hover:text-cyan-500">
              <button className="hover:text-cyan-500">Fair Trade Practicing</button>
            </Link>
            <Link to="/contactus" className="hover:text-cyan-500">
              {t("Contact us")}
            </Link>
            <Link to="/visitjaipur" className="hover:text-cyan-500">
              Visit Us in Jaipur
            </Link>
          </div>

         <div className="flex w-1/4 flex-col h-36 ml-10 mt-8 gap-2 items-start">
  <button className="text-lg text-cyan-500 hover:text-cyan-500">
    {t("MyAccount")}
  </button>
  <Link to="/privacy">
    <button className="hover:text-cyan-500">{t("Privacy")}</button>
  </Link>

  <Link to="/cart">
    <button className="hover:text-cyan-500">{t("Checkout")}</button>
  </Link>
  <Link to="/faq">
    <button className="hover:text-cyan-500">FAQ</button>
  </Link>
  <Link to="/blogs">Blog</Link>

  {Isauthanticate() ? (
    <button onClick={Logout} className="hover:text-cyan-500">
      Logout
    </button>
  ) : (
    <Link to="/login">
      <button className="hover:text-cyan-500">Login</button>
    </Link>
  )}
</div>


          <div className="flex w-1/4 flex-col h-36 ml-10 mt-8 gap-2 items-start">
            <button className="text-lg text-cyan-500 hover:text-cyan-500">
              {t("CATEGORIES")}
            </button>
            <Link to={`/category/Rings`} className="hover:text-cyan-500">
              <button className="hover:text-cyan-500">{t("Rings")}</button>
            </Link>
            <Link to={`/category/Necklaces`} className="hover:text-cyan-500">
              <button className="hover:text-cyan-500">{t("Necklaces")}</button>
            </Link>
            <Link to={`/category/Bracelet`} className="hover:text-cyan-500">
              <button className="hover:text-cyan-500">{t("Bracelet")}</button>
            </Link>
            <Link to="/category/Rings">
            Rings
            </Link>
            <Link to="/category/Pendant">
            Pendant
            </Link>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="w-full font-bold h-44 text-sm flex lg:hidden gap-2 mb-2 mt-6 p-2">
          <div className="w-1/2 flex text-sm flex-col gap-4">
            <Link to="/">
              <img className="bg-white" src="/puramente logo.png" alt="" />
            </Link>
            <div className="flex gap-4">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/puramenteinternational/"
                className="hover:text-cyan-500"
              >
                <AiFillInstagram className="h-6 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/puramenteinternational1/"
                className="hover:text-cyan-500"
              >
                <FaFacebook className="h-6 w-8" />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@puramenteinternational1982"
                className="hover:text-cyan-500"
              >
                <FaYoutube className="h-6 w-8" />
              </a>
              
            </div>
          </div>
          <div className="flex items-center w-1/2 flex-col gap-2">
            <button className="hover:text-cyan-500 text-cyan-500">
              SERVICES
            </button>
            <Link to="/fairtrade" className="hover:text-cyan-500">
              <button className="hover:text-cyan-500">Fair Trade</button>
            </Link>
            <Link to="/contactus" className="hover:text-cyan-500">
              {t("Contact us")}
            </Link>
            <Link to="/blogs">Blog</Link>
            {Isauthanticate() ? (
  <button onClick={Logout} className="hover:text-cyan-500">
    Logout
  </button>
) : (
  <Link to="/login">
    <button className="hover:text-cyan-500">Login</button>
  </Link>
)}

          </div>
          <div className="flex w-1/2 flex-col items-center text-sm gap-2">
            <button className=" text-cyan-500 hover:text-cyan-500">
              {t("MY ACCOUNT")}
            </button>
            <Link to="/privacy">
              <button className="hover:text-cyan-500">{t("Privacy")}</button>
            </Link>
            <Link to="/visitjaipur">
              <button className="hover:text-cyan-500">Visit Jaipur</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-2">
        <h1 className="text-white m-8">
          {t(
            "© 2025 Puramente International All Rights Reserved! Developed By Netbond Technologies"
          )}
        </h1>
      </div>
    </div>
  );
}
