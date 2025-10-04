import { useTranslation } from "react-i18next";
import FairTradePrinciples from "../newcomponent/tradeinfromation";
import VideoSection from "../newcomponent/youtubevideo";
import HelpSection from "../newcomponent/help";
import InfoFairTrade from "../newcomponent/infofairtrade";
import AOS from "aos";
import "aos/dist/aos.css";
import VisitJaipur from "../newcomponent/visitjaipur";
import { Helmet } from "react-helmet-async";

AOS.init();

export default function Aboutus() {
  const { t } = useTranslation(); // Initialize translation
  return (
    <>
      <Helmet>
        <title>About Puramente Jewel | Timeless Jewelry Design </title>
        <meta
          name="description"
          content="Learn about Puramente Jewel International - creators of elegant jewelry including necklaces, earrings & rings. Serving France, UK, USA & across Europe.																									"
        />
        <meta
          name="keywords"
          content="Puramente Jewel, About Jewelry Brand, Luxury Jewelry, Designer Jewelry, Jewelry Europe																									"
        />
        <link rel="canonical" href="https://puramentejewel.com/aboutus" />
      </Helmet>

      <h1 className="text-center text-4xl font-bold text-gray-800 mt-8 mb-6 capitalize">
        About Puramente Jewel International
      </h1>
      {/* Rest of your About Us page */}

      <div className="bg-cyan-200">
        {/* WHY ARAWALI JEWELLERS SECTION */}
        <div className="h-screen w-full flex flex-col lg:mt-0 lg:flex-row">
          <div className="w-full lg:w-1/2 py-10 flex flex-col justify-center lg:m-10 items-center">
            <h1 className="text-2xl font-bold text-black">
              {t("Why Puramente International")}
            </h1>
            <p className="m-8 mb-0 text-center font-serif leading-8 font-semibold text-gray-700">
              Best among all customized gemstone jewelry manufacturers in
              (jaipur) india . Since 2005, Puramente International has been
              providing one-stop services to jewelry professionals & brands
              worldwide. Our clients come from over 19 countries throughout the
              world and range from luxury high street boutiques to online
              retailers capitalizing on the latest trends.
            </p>
            <p className="m-8 text-center lg:flex hidden font-serif leading-8 font-semibold text-gray-700">
              We are proud to have worked with some of the biggest names in the
              jewelry industry in India and outside of india as well. We are
              proud on us to be the best among all customized gemstone jewelry
              manufacturers in India.
            </p>
          </div>
          <div className="lg:w-1/2 flex items-center h-screen w-full">
            <img
              className="h-full object-contain w-full"
              src="/aboutus.jpg"
              alt=""
            />
          </div>
        </div>

        {/* OUR STORY SECTION */}
        <div
          data-aos="fade-up"
          data-aos-duration="600"
          className="h-screen md:pb-6 w-full flex flex-col lg:flex-row mt-10 lg:mt-2"
        >
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:m-10 items-center">
            <h1 className="text-2xl font-bold text-black">{t("OUR STORY")}</h1>
            <p className="m-8 mb-0 text-center font-serif leading-8 font-semibold text-gray-700">
              {t(
                "Nestled in the heart of exquisite craftsmanship, Puramente International is a testament to tradition, elegance, and timeless beauty. Our journey began with a passion for fine jewelry and a commitment to offering pieces that blend artistry with luxury. With years of dedication, we have grown into a trusted name in the world of jewelry, known for our impeccable designs, premium quality, and exceptional service."
              )}
            </p>
            <p className="m-8 lg:flex text-center hidden font-serif leading-8 font-semibold text-gray-700">
              {t(
                "We take pride in our craftsmanship, sourcing only the finest materials and working with skilled artisans to bring our designs to life. Whether you're looking for a statement piece for a special occasion or a timeless treasure to cherish forever"
              )}
            </p>
          </div>
          <div className="lg:w-1/2 lg:mt-5 w-full">
            <img
              className="h-[50vh] lg:h-[90vh] w-full"
              src="https://i.postimg.cc/NfD50gHY/IMG-6855.jpg"
              alt="Our Story – best wholesale jewelry suppliers in India, custom jewellery manufacturers India, imitation jewellery designers"
            />
          </div>
        </div>
        <VisitJaipur />
        <InfoFairTrade />
        <FairTradePrinciples />
        <VideoSection />
        <HelpSection />
      </div>
    </>
  );
}
