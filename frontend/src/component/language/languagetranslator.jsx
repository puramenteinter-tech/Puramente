import { useEffect } from "react";

export default function LanguageSwitcher() {
  useEffect(() => {
    // Determine target language from country once per session
    const applyAutoTranslate = (target) => {
      try {
        // Set cookie so Google Translate remembers selection
        document.cookie = `googtrans=/en/${target};path=/`;
        document.cookie = `googtrans=/en/${target};path=/;domain=${window.location.hostname}`;

        // Try to set the dropdown value when widget is ready
        let tries = 0;
        const interval = setInterval(() => {
          const select = document.querySelector("select.goog-te-combo");
          tries += 1;
          if (select) {
            if (select.value !== target) {
              select.value = target;
              select.dispatchEvent(new Event("change"));
            }
            clearInterval(interval);
          }
          if (tries > 40) clearInterval(interval); // ~20s timeout
        }, 500);
      } catch {}
    };

    const setLanguageByCountry = async () => {
      if (sessionStorage.getItem("gt_auto_applied")) return;
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const country = (data?.country || "").toUpperCase();
        // Map country to target language for Google Translate
        const map = {
          IN: "en", // English for India
          GB: "en", // English for UK
          UK: "en",
          US: "en", // English for US
          FR: "fr", // French for France
          CA: "en", // Canada
          AE: "en", // UAE (keep English)
        };
        const target = map[country] || "en"; // x-default fallback → English
        applyAutoTranslate(target);
        sessionStorage.setItem("gt_auto_applied", "1");
      } catch {
        // Fallback to English
        applyAutoTranslate("en");
        sessionStorage.setItem("gt_auto_applied", "1");
      }
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,hi,de,fr,es,it,pt,da,sv,no,nl,tr,he,pl,ro,el,hu,ga,lt,lb,ru,ar",
            layout:
              window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
        setLanguageByCountry();
      };

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setLanguageByCountry();
    }
  }, []);

  return (
    <div className="absolute top-20  right-0 ">
      <div id="google_translate_element"></div>
    </div>
  );
}
