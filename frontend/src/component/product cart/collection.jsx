import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Collection() {
  const { t } = useTranslation();
  const [shuffledCategories, setShuffledCategories] = useState([]);

  const categories = [
    { name: t("Rings"), img: "https://i.postimg.cc/3w555Gxw/RS0193.jpg", slug: "ring" },
    { name: t("Bracelets"), img: "https://i.postimg.cc/SxwqS5Dk/ND008-B-PMS.jpg", slug: "bracelet" },
    { name: t("Earrings"), img: "https://i.postimg.cc/kGtB48Kp/COL0032E.jpg", slug: "earring" },
    { name: t("Necklaces"), img: "https://i.postimg.cc/zXQY76mK/NS0242.jpg", slug: "necklace" },
  ];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Get the current day (changes daily)
    const today = new Date().toDateString();

    // Check if shuffle already stored for today
    const stored = localStorage.getItem("shuffledCategoriesDate");

    if (stored !== today) {
      // Shuffle categories for today
      const shuffled = [...categories].sort(() => Math.random() - 0.5);
      localStorage.setItem("shuffledCategories", JSON.stringify(shuffled));
      localStorage.setItem("shuffledCategoriesDate", today);
      setShuffledCategories(shuffled);
    } else {
      // Use stored shuffle
      const saved = JSON.parse(localStorage.getItem("shuffledCategories")) || categories;
      setShuffledCategories(saved);
    }
  }, [t]); // include translation dependency

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 text-cyan-700 w-full py-6">
      <div data-aos="fade-down">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center my-8">
          {t("Categories")}
        </h1>

        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-2 
            lg:grid-cols-4 
            gap-x-8 
            gap-y-10 
            justify-items-center
          "
        >
          {shuffledCategories.map((item, index) => (
            <Link
              to={`/category/${item.name}`}
              key={index}
              data-aos="zoom-in"
              className="
                w-[160px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[280px] 
                bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl 
                transition-all hover:scale-105 flex flex-col items-center
              "
            >
              <img
                className="
                  rounded-full 
                  w-[130px] sm:w-[170px] md:w-[190px] lg:w-[200px] 
                  h-[130px] sm:h-[170px] md:h-[190px] lg:h-[200px] 
                  object-cover
                "
                src={item.img}
                alt={item.name}
              />
              <h1 className="text-base sm:text-lg md:text-xl font-bold mt-3 text-center">
                {item.name}
              </h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
