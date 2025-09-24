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
    const supportedLocales = [
      "en-in",
      "en-gb",
      "en-us",
      "fr-fr",
      // newly supported regional paths
      "en-uk",
      "en-ca",
      "en-ae",
    ];
    if (!alreadySet && !supportedLocales.includes(pathLocale)) {
      try {
        fetch("https://ipapi.co/json/")
          .then((r) => r.json())
          .then((data) => {
            const country = (data?.country || "").toUpperCase();
            const map = {
              IN: "en-in",
              GB: "en-uk", // use en-uk path for UK
              UK: "en-uk", // safety alias
              US: "en-us",
              FR: "fr-fr",
              CA: "en-ca",
              AE: "en-ae",
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
          const supportedLocales = [
            "en-in",
            "en-gb",
            "en-us",
            "fr-fr",
            "en-uk",
            "en-ca",
            "en-ae",
          ];
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
                const pathWithOrWithoutLocale = location.pathname;
                const segments = pathWithOrWithoutLocale.split("/").filter(Boolean);
                const hasLocalePrefix = [
                  "en-in",
                  "en-gb",
                  "en-us",
                  "fr-fr",
                  "en-uk",
                  "en-ca",
                  "en-ae",
                ].includes(segments[0]);
                const restPathOnly = `/${hasLocalePrefix ? segments.slice(1).join("/") : segments.join("/")}`;
                const canonicalHref = hasLocalePrefix
                  ? `${origin}/${segments[0]}${restPathOnly === "/" ? "" : restPathOnly}`
                  : `${origin}${restPathOnly === "/" ? "" : restPathOnly}`;
                return (
                  <>
                    <link rel="canonical" href={canonicalHref} />
                    <meta property="og:url" content={canonicalHref} />
                  </>
                );
              })()}
              {(() => {
                const origin = typeof window !== "undefined" ? window.location.origin : "";
                const restPath = `/${hasLocale ? segments.slice(1).join("/") : segments.join("/")}`;
                // code: URL path segment, hreflang: attribute value
                const locales = [
                  { code: "en-in", hreflang: "en-in" },
                  { code: "en-us", hreflang: "en-us" },
                  // UK path requested as en-uk but valid hreflang is en-gb
                  { code: "en-uk", hreflang: "en-gb" },
                  { code: "en-gb", hreflang: "en-gb" },
                  { code: "en-ca", hreflang: "en-ca" },
                  { code: "en-ae", hreflang: "en-ae" },
                  { code: "fr-fr", hreflang: "fr-fr" },
                ];
                const xDefaultHref = `${origin}${restPath}`;
                return (
                  <>
                    {locales.map((lng) => (
                      <link
                        key={`${lng.code}-${lng.hreflang}`}
                        rel="alternate"
                        hrefLang={lng.hreflang}
                        href={`${origin}/${lng.code}${restPath}`}
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
