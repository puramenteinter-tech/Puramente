import Shopall from "./component/pages/shopall";
import Contactus from "./component/pages/contactus";
import Sign2 from "./component/pages/sign2";
import Home from "./component/pages/home";
import SubCategoryPage from "./component/product cart/subcategory";
import Login2 from "./component/pages/login2";
import Checkout from "../src/component/newcomponent/checkout";
import { CartProvider } from "./component/newcomponent/cartcontext";
import Fairtradepage from "./component/pages/fairtradepage";
import Aboutus from "./component/pages/aboutus";
import Layout from "./component/layout/layout";
import Profile from "./component/pages/profile";
import AddProduct from "./component/admin/component/addproduct";
import OrderList from "./component/admin/component/orderlist";
import AdminProductList from "./component/admin/component/adminproductlist";
import AdminUserView from "./component/admin/component/adminusersview";
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from "react-router-dom";
import { Isauthanticate, IsAdmin } from "./component/authantication/isauthanticat";
import { useEffect } from "react";
import i18n from "./component/language/i18n";
import Adminhome from "./component/admin/component/adminhome";
import SingleProduct from "./component/product cart/singleproduct";
import Faqsection from "./component/newcomponent/faq";
import Category from "./component/pages/category";
import VisitJaipur from "./component/newcomponent/visitjaipur";
import Categorycart from "./component/product cart/categorycart";
import ExcelUploader from "./component/admin/component/exceluploader";
import PrivacyPolicy from "./component/newcomponent/privacy";
import ShowBlogs from "./component/button/Blogs/blogs";
import BlogDetails from "./component/button/Blogs/BlogDetails";
import AdminBlogList from "./component/admin/component/AdminBlogList";
import BlogUpload from "./component/admin/component/BlogUpload";
import EditBlog from "./component/admin/component/Editblog";
import EditProduct from "./component/admin/component/edit-product";
import AllDesigns from "./component/pages/alldesign";
function LanguageRoutes() {
  const { lang } = useParams();
  const supported = ["en", "hi", "fr", "de", "es", "it", "pt"];
  useEffect(() => {
    const language = supported.includes(lang) ? lang : "en";
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [lang]);

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="login" element={<Login2 />}></Route>
      <Route path="signup" element={<Sign2 />}></Route>
      <Route path="cart" element={<Checkout />}></Route>
      <Route path="shopall" element={<Shopall />}></Route>
      <Route path="aboutus" element={<Aboutus />}></Route>
      <Route path="category/alldesigns" element={<AllDesigns />} />
      <Route path="contactus" element={<Contactus />}></Route>
      <Route path="category/:category/:subcategory" element={<SubCategoryPage />} />
      <Route path="profile" element={<Profile />}></Route>
      <Route path="userview" element={Isauthanticate() && IsAdmin() ? <AdminUserView /> : <Navigate to="/login" replace />} />
      {/* admin routes */}
      <Route path="dashboard" element={Isauthanticate() && IsAdmin() ? <Adminhome /> : <Navigate to="/login" replace />} />
      <Route path="addproduct" element={Isauthanticate() && IsAdmin() ? <AddProduct /> : <Navigate to="/login" replace />} />
      <Route path="orderlist" element={Isauthanticate() && IsAdmin() ? <OrderList /> : <Navigate to="/login" replace />} />
      <Route path="product-list" element={Isauthanticate() && IsAdmin() ? <AdminProductList /> : <Navigate to="/login" replace />} />
      <Route path="singleproduct" element={<SingleProduct />}></Route>
      <Route path="category" element={<Category/>}></Route>
      <Route path="fairtrade" element={<Fairtradepage />}></Route>
      <Route path="privacy" element={<PrivacyPolicy />}></Route>
      <Route path="faq" element={<Faqsection />}></Route>
      <Route path="visitjaipur" element={<VisitJaipur />}></Route>
      <Route path="uploadblog" element={Isauthanticate() && IsAdmin() ? <BlogUpload/> : <Navigate to="/login" replace />} />
      <Route path="blogs" element={<ShowBlogs/>} />
      <Route path="blogs/:slug" element={<BlogDetails/>} />
      <Route path="blog-list" element={Isauthanticate() && IsAdmin() ? <AdminBlogList/> : <Navigate to="/login" replace />} />
      <Route path="admin/edit-blog/:id" element={Isauthanticate() && IsAdmin() ? <EditBlog/> : <Navigate to="/login" replace />} />
      <Route path="admin/edit-product/:id" element={Isauthanticate() && IsAdmin() ? <EditProduct/> : <Navigate to="/login" replace />} />
      <Route path="category/Pendant" element={<Navigate to="/category/Pendants" replace />} />
      <Route path="category/Ring" element={<Navigate to="/category/Rings" replace />} />
      <Route path="category/Bracelet" element={<Navigate to="/category/Bracelets" replace />} />
      <Route path="category/Earring" element={<Navigate to="/category/Earrings" replace />} />
      <Route path="category/Necklace" element={<Navigate to="/category/Necklaces" replace />} />
      <Route path="category/:category" element={<Categorycart />}></Route>
      <Route path="singleproduct/:id" element={<SingleProduct />}></Route>
      <Route path="excelfile" element={<ExcelUploader />}></Route>
    </Routes>
  );
}

function App() {
  return (
    <>
      <Router>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Optional language prefix */}
              <Route path=":lang/*" element={<LanguageRoutes />} />
              <Route path="/" element={<Home />}></Route>
              <Route path="/login" element={<Login2 />}></Route>
              <Route path="/signup" element={<Sign2 />}></Route>
              <Route path="/cart" element={<Checkout />}></Route>
              <Route path="/shopall" element={<Shopall />}></Route>
              <Route path="/aboutus" element={<Aboutus />}></Route>
           <Route path="/category/alldesigns" element={<AllDesigns />} />
              <Route path="/contactus" element={<Contactus />}></Route>
              <Route
                path="/category/:category/:subcategory"
                element={<SubCategoryPage />}
              />

              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/userview" element={Isauthanticate() && IsAdmin() ? <AdminUserView /> : <Navigate to="/login" replace />} />
              {/* admin routes */}
              <Route path="/dashboard" element={Isauthanticate() && IsAdmin() ? <Adminhome /> : <Navigate to="/login" replace />} />
              <Route path="/addproduct" element={Isauthanticate() && IsAdmin() ? <AddProduct /> : <Navigate to="/login" replace />} />
              <Route path="/orderlist" element={Isauthanticate() && IsAdmin() ? <OrderList /> : <Navigate to="/login" replace />} />
              <Route path="/product-list" element={Isauthanticate() && IsAdmin() ? <AdminProductList /> : <Navigate to="/login" replace />} />
              <Route path="/singleproduct" element={<SingleProduct />}></Route>
              <Route path="/category" element={<Category/>}></Route>
              <Route path="/fairtrade" element={<Fairtradepage />}></Route>
              <Route path="privacy" element={<PrivacyPolicy />}></Route>
              <Route path="faq" element={<Faqsection />}></Route>
              <Route path="visitjaipur" element={<VisitJaipur />}></Route>
              <Route path="/uploadblog" element={Isauthanticate() && IsAdmin() ? <BlogUpload/> : <Navigate to="/login" replace />} />
              <Route path="/blogs" element={<ShowBlogs/>} />
              <Route path="/blogs/:slug" element={<BlogDetails/>} />

              <Route path="/blog-list" element={Isauthanticate() && IsAdmin() ? <AdminBlogList/> : <Navigate to="/login" replace />} />
              <Route path="/admin/edit-blog/:id" element={Isauthanticate() && IsAdmin() ? <EditBlog/> : <Navigate to="/login" replace />} />
      
              <Route path="/admin/edit-product/:id" element={Isauthanticate() && IsAdmin() ? <EditProduct/> : <Navigate to="/login" replace />} />
<Route path="/category/Pendant" element={<Navigate to="/category/Pendants" replace />} />
<Route path="/category/Ring" element={<Navigate to="/category/Rings" replace />} />
<Route path="/category/Bracelet" element={<Navigate to="/category/Bracelets" replace />} />
<Route path="/category/Earring" element={<Navigate to="/category/Earrings" replace />} />
<Route path="/category/Necklace" element={<Navigate to="/category/Necklaces" replace />} />
              <Route
                path="/category/:category"
                element={<Categorycart />}
              ></Route>
              <Route
                path="/singleproduct/:id"
                element={<SingleProduct />}
              ></Route>
              <Route path="/excelfile" element={<ExcelUploader />}></Route>
            </Routes>
          </Layout>
        </CartProvider>
      </Router>
    </>
  );
}

export default App;
