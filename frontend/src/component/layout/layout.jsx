import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar1 from "../navbar/navbar1";
import Navbar2 from "../navbar/navbar2";
import Footer from "../footer/footer";
import WhatsAppButton from "../newcomponent/whatsappbutton";
import Loader from "../loader/loader";
import { Helmet } from "react-helmet-async";
import i18n from "../language/i18n";

const Layout = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Geo-based language detection on first load (respect manual selection in URL)
  useEffect(() => {
    const alreadySet = sessionStorage.getItem("lang_auto_set");
    const pathLang = location.pathname.split("/")[1];
    const supported = ["en", "hi", "fr", "de", "es", "it", "pt"];
    if (!alreadySet && !supported.includes(pathLang)) {
      try {
        fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .then((data) => {
            const country = (data?.country || "").toUpperCase();
            const map = {
              FR: "fr",
              DE: "de",
              ES: "es",
              IT: "it",
              PT: "pt",
              IN: "hi",
            };
            const lang = map[country] || "en";
            if (i18n.language !== lang) i18n.changeLanguage(lang);
            sessionStorage.setItem("lang_auto_set", "1");
          })
          .catch(() => {});
      } catch {}
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
       <Helmet>
        <meta
          name="google-site-verification"
          content="8o-zQTBUtcnHGEY_Cq1xMaeyzjK57z1J6LgIrR0J_gw"
        />
      </Helmet>
    <div>
      <Navbar1 />
      <Navbar2 />
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-[65vh]">
            <Loader />
          </div>
        ) : (
          children
        )}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
    </>
  );
};

export default Layout;
