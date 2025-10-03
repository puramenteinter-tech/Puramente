import Carousel from "../Carousel/Carousel";
import Collection from "../product cart/collection";
import Topproduct from "../product cart/topproduct";
import InfoCards from "../newcomponent/info";
import WhoWeAre from "../newcomponent/woweare";
import HelpSection from "../newcomponent/help";
import Jewelryinfo from "../newcomponent/Jewelryinfo";
import VideoSection from "../newcomponent/youtubevideo";
import HomeProductCard from "../product cart/homeproduct";
import VideoTestimonials from "../newcomponent/videotestimonials";
import Faqsection from "../newcomponent/faq";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://puramentejewel.com";
  const canonicalUrl = `${origin}${location.pathname || "/"}`;
  return (
     <>
      <Helmet>
        <title>Jewelry Manufacturer & Wholesaler | Puramente Jewel</title>
        <meta
          name="description"
          content="Puramente Jewel International – trusted jewelry manufacturer & wholesaler. Finest necklaces, earrings, bracelets & more for France, UK, USA & Europe."
        />
        <meta
          name="keywords"
          content="Jewelry Manufacturer, Jewelry Wholesaler, Puramente Jewel, Necklace Earrings Bracelets, Jewelry Europe"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {/* Existing home page content */}
      
     

      {/* Rest of your home page */}
    
    <div>
      <Carousel />
      <h1 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-6 capitalize">
        Welcome to Puramente Jewel
      </h1>
      <Collection />
      <HomeProductCard />
      <Topproduct />
      <WhoWeAre />
      <Jewelryinfo />
      <InfoCards />
      <VideoSection />
      <VideoTestimonials />
      <Faqsection/>
      <HelpSection />
    </div>
    </>
  );
}
