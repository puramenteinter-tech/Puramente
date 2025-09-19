import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar1 from "../navbar/navbar1";
import Navbar2 from "../navbar/navbar2";
import Footer from "../footer/footer";
import WhatsAppButton from "../newcomponent/whatsappbutton";
import Loader from "../loader/loader";
import { Helmet } from "react-helmet-async";
import i18n from "../language/i18n";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Geo-based language detection on first load (respect manual selection in URL)
  useEffect(() => {
    const alreadySet = sessionStorage.getItem("lang_auto_set");
    const pathLocale = location.pathname.split("/")[1];
    const supportedLocales = ["en-in", "en-gb", "en-us", "fr-fr"];
    if (!alreadySet && !supportedLocales.includes(pathLocale)) {
      try {
        fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .then((data) => {
            const country = (data?.country || "").toUpperCase();
            const map = {
              IN: "en-in",
              GB: "en-gb",
              US: "en-us",
              FR: "fr-fr",
            };
            const locale = map[country] || "en-us";
            const i18nLang = locale === "fr-fr" ? "fr" : "en";
            if (i18n.language !== i18nLang) i18n.changeLanguage(i18nLang);
            // Redirect to language-prefixed URL for SEO-friendly, country-based language
            const target = `/${locale}${location.pathname}`;
            navigate(target, { replace: true });
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
      {
        (() => {
          const segments = location.pathname.split("/").filter(Boolean);
          const supportedLocales = ["en-in", "en-gb", "en-us", "fr-fr"];
          const hasLocale = supportedLocales.includes(segments[0]);
          const currentLocale = hasLocale ? segments[0] : "en-us";
          return (
            <Helmet htmlAttributes={{ lang: currentLocale }}>
              <meta
                name="google-site-verification"
                content="8o-zQTBUtcnHGEY_Cq1xMaeyzjK57z1J6LgIrR0J_gw"
              />
              {(() => {
                const origin = typeof window !== "undefined" ? window.location.origin : "";
                const restPath = `/${hasLocale ? segments.slice(1).join("/") : segments.join("/")}`;
                const locales = ["en-in", "en-gb", "en-us", "fr-fr"];
                const xDefaultHref = `${origin}${restPath}`;
                return (
                  <>
                    {locales.map((lng) => (
                      <link
                        key={lng}
                        rel="alternate"
                        hrefLang={lng}
                        href={`${origin}/${lng}${restPath}`}
                      />
                    ))}
                    <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />
                  </>
                );
              })()}
            </Helmet>
          );
        })()
      }
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
