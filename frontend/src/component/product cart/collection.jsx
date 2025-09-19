import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

AOS.init();

export default function Collection() {
  const { t } = useTranslation();

  const categories = [
    { name: t("Rings"), img: "https://i.postimg.cc/3w555Gxw/RS0193.jpg", slug: "ring" },
    { name: t("Bracelets"), img: "https://i.postimg.cc/SxwqS5Dk/ND008-B-PMS.jpg", slug: "bracelet" },
    { name: t("Earrings"), img: "https://i.postimg.cc/kGtB48Kp/COL0032E.jpg", slug: "earring" },
    { name: t("Necklaces"), img: "https://i.postimg.cc/zXQY76mK/NS0242.jpg", slug: "necklace" },
    { name: t("Pendants"), img: "https://i.postimg.cc/zXQY76mK/NS0242.jpg", slug: "pendant" },
  ];

  return (
    <div className="px-4 text-cyan-700">
      <div data-aos="fade-down" data-aos-duration="600">
        <h1 className="text-3xl sm:text-4xl m-6 sm:m-10 font-bold text-center">
          {t("Categories")}
        </h1>
        <div className="w-full text-center grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-5  justify-items-center">
          {categories.map((item, index) => (
            <div
              key={index}
              className="w-40 bg-white sm:w-48 m-2 md:w-56 lg:w-56 lg:m-2 h-auto flex flex-col items-center lg:p-4  shadow-lg rounded-lg"
            >
              <Link to={`/category/${item.name}`}>
                <img
                  className="rounded-full w-32 sm:w-36 md:w-40 lg:w-44 h-32 sm:h-36 md:h-40 lg:h-44 object-cover"
                  src={item.img}
                  alt={item.name}
                />
                <h1 className="text-lg sm:text-xl font-bold mt-3">{item.name}</h1>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 