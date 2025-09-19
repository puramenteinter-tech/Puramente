import { useEffect } from "react";

export default function LanguageSwitcher() {
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,hi,de,fr,es,it,pt,da,sv,no,nl,tr,he,pl,ro,el,hu,ga,lt,lb,ru",
            layout:
              window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="absolute top-8  right-0 ">
      <div id="google_translate_element"></div>
    </div>
  );
}
