import FairTradePrinciples from "../newcomponent/tradeinfromation";
import TradeBanner from "../newcomponent/tradebanner";
import InfoFairTrade from "../newcomponent/infofairtrade";
import Jewelryinfo from "../newcomponent/Jewelryinfo";
import HelpSection from "../newcomponent/help";
import { Helmet } from "react-helmet-async";
export default function Fairtradepage() {
  return (
    <div>
      <>
        <Helmet>
          <title>Fair Trade Jewelry | Manufacturer & Wholesaler </title>
          <meta
            name="description"
            content="Puramente Jewel International - fair trade jewelry manufacturer & wholesaler. Ethical & sustainable designs shipped to France, UK, USA & across Europe.																									"
          />
          <meta
            name="keywords"
            content="Fair Trade Jewelry, Jewelry Manufacturer, Jewelry Wholesaler, Ethical Jewelry Supplier, Sustainable Jewelry Europe																									"
          />
          <link rel="canonical" href="https://puramentejewel.com/fairtrade" />
        </Helmet>

        <h1 className="text-center text-4xl font-bold text-gray-800 mt-8 mb-6 capitalize">
          Fair Trade Jewelry by Puramente Jewel
        </h1>
        {/* Rest of Fairtrade page */}

        <TradeBanner />
        <FairTradePrinciples />
        <InfoFairTrade />
        <Jewelryinfo />
        <HelpSection />
      </>
    </div>
  );
}
