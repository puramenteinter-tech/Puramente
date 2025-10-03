import { useState } from "react";
import { Link } from "react-router-dom";
import {
  File,
  FilePlus,
  FileText,
  Menu,
  TableProperties,
  TicketPercent,
  User,
  UserPen,
  UserRoundSearch,
  View,
} from "lucide-react";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-28 flex flex-col">
      {/* Desktop Header */}
      <div className="hidden lg:flex justify-between items-center bg-black text-white py-6 px-8">
        <h1 className="text-2xl font-bold">Admin Control</h1>
        <nav className="flex mx-24 gap-16">
          <Link to="/addproduct" className="flex items-center gap-2">
            <FilePlus /> Add Product
          </Link>
          <Link to="/orderlist" className="flex items-center gap-2">
            <View /> View Order
          </Link>
          <Link to="/userview" className="flex items-center gap-2">
            <UserRoundSearch /> View User
          </Link>
          <Link to="/excelfile" className="flex items-center gap-2">
            <File /> Excel File Upload
          </Link>
          <Link to="/uploadblog" className="flex items-center gap-2">
            <FileText /> Upload Blog
          </Link>
              <Link to="/blog-list" className="flex items-center gap-2">
            <FileText /> Blog List
          </Link>
           <Link to="/product-list" className="flex items-center gap-2">
            <FileText /> Product List
          </Link>
          
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center bg-black text-white py-4 px-6">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <User className="w-8 h-8" />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden z-40 flex flex-col bg-black text-white w-full py-4 px-6 gap-4">
          <Link to="/addproduct" className="flex items-center gap-2">
            <FilePlus /> Add Product
          </Link>
          <Link to="/userview" className="flex items-center gap-2">
            <UserRoundSearch /> View User
          </Link>
          <Link to="/excelfile" className="flex items-center gap-2">
            <File /> Excel File Upload
          </Link>
          <Link to="/uploadblog" className="flex items-center gap-2">
            <FileText /> Upload Blog
          </Link>
            <Link to="/blog-list" className="flex items-center gap-2">
            <FileText /> Blog List
          </Link>
            <Link to="/product-list" className="flex items-center gap-2">
            <FileText /> Product List
          </Link>
        </div>
      )}
    </div>
  );
}
