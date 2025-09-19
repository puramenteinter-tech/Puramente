import Dashboard from "../admin/dashboard";
import Footer from "../footer/footer";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Dashboard/>
      <main>{children}</main>
      <Footer/>
    </div>
  );
};
export default AdminLayout;
