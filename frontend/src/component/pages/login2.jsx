import AOS from "aos";
import "aos/dist/aos.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseURL from "../../baseurl";
import { useCart } from "../../component/newcomponent/cartcontext"; // ✅ Cart context import

AOS.init();

export default function Login2() {
  const { t } = useTranslation();
  const { setCartFromBackend } = useCart(); // ✅ new function to set cart after login

  const [logindata, setLogindata] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setLogindata({ ...logindata, [name]: value });
  }

  async function userLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${BaseURL}/api/users/login`, logindata);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userId", response.data.user._id); // ✅ Save userId for cart

      // ✅ Merge guest cart (local) into backend cart for this user
      try {
        const guestCartRaw = localStorage.getItem("cart");
        const guestItems = guestCartRaw ? JSON.parse(guestCartRaw) : [];
        if (guestItems.length) {
          await axios.post(
            `${BaseURL}/api/cart/merge`,
            { userId: response.data.user._id, items: guestItems },
            { headers: { Authorization: `Bearer ${response.data.token}` } }
          );
        }
      } catch (mergeErr) {
        console.warn("Cart merge failed:", mergeErr?.message || mergeErr);
      }

      // ✅ Backend se cart fetch karo
      try {
        const cartRes = await axios.get(`${BaseURL}/api/cart/${response.data.user._id}`, {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        if (cartRes.data?.items) {
          setCartFromBackend(cartRes.data.items); // ✅ Cart context update
        }
      } catch (err) {
        console.warn("No cart found or failed to fetch cart:", err.message);
      }

      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials, please try again.");
    }
  }

  return (
    <div className="w-full flex h-screen justify-center items-center">
      <div
        data-aos="fade-down"
        data-aos-duration="600"
        className="w-[70%] bg-background-sky flex flex-col items-center lg:flex-row lg:h-[75%] h-[60%] shadow-2xl shadow-buttext-button-orange"
      >
        <div className="lg:w-1/2 w-full h-40 lg:h-full flex items-center">
          <img
            className="animate-pulse w-64 h-20 m-12 lg:m-20 lg:h-56 lg:w-64"
            src="/userlogin.svg"
            alt="User"
          />
        </div>
        <form
          onSubmit={userLogin}
          className="flex w-full bg-white flex-col h-full p-2 lg:w-1/2 gap-4 justify-center items-center"
        >
          <h1 className="text-2xl text-button-orange font-bold mt-4 lg:mt-0">
            {t("login")}
          </h1>
          {error && <p className="text-red-500">{error}</p>}
          <input
            onChange={handleChange}
            className="lg:w-60 w-40 p-2 h-10 border lg:text-lg focus:outline-buttext-button-orange border-gray-400 rounded-lg"
            type="email"
            name="email"
            placeholder={t("email_placeholder")}
          />
          <input
            onChange={handleChange}
            className="lg:w-60 w-40 p-2 h-10 lg:h-10 border focus:outline-buttext-button-orange lg:text-lg border-gray-400 rounded-lg"
            type="password"
            name="password"
            placeholder={t("password_placeholder")}
          />
          <button
            type="submit"
            className="lg:w-60 w-28 h-8 text-sm lg:h-10 p-2 text-white bg-background-sky rounded-2xl font-bold bg-buttext-button-orange hover:bg-buttext-button-orange hover:shadow-lg hover hover:shadow-buttext-button-orange"
          >
            {t("login_button")}
          </button>
          <p className="flex items-center flex-col lg:flex-row">
            {t("no_account")}
            <Link
              to="/signup"
              className="text-button-orange font-bold text-lg p-2"
            >
              {t("sign_up")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
