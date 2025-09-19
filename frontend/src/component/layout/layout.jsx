import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar1 from "../navbar/navbar1";
import Navbar2 from "../navbar/navbar2";
import Footer from "../footer/footer";
import WhatsAppButton from "../newcomponent/whatsappbutton";
import Loader from "../loader/loader";
import { Helmet } from "react-helmet-async";

const Layout = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
   

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
