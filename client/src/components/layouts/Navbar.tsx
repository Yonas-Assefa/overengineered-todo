import { useLocation, useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaBell,
  FaThLarge,
  FaRegFileAlt,
  FaBars,
} from "react-icons/fa";

export const Navbar = () => {
  const location = useLocation();
  const isCollectionDetail = useMatch("/collections/:id");

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#17181C] border-b border-gray-800">
      <div className="flex items-center gap-4 text-gray-400">
        {isCollectionDetail && (
          <Link
            to="/"
            className="flex items-center gap-2 pr-4 text-sm font-medium hover:text-white transition-colors"
          >
            <FaBars size={18} />
          </Link>
        )}

        <Link
          to="/"
          className={`flex items-center gap-2 text-sm font-medium hover:text-white transition-colors ${
            location.pathname === "/collections" ? "text-white" : ""
          }`}
        >
          <FaThLarge size={18} /> Collections
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-pink-500 rounded-full hover:bg-pink-600 transition-colors">
          <FaPlus size={14} className="text-white" />
        </button>

        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <FaSearch size={18} />
        </button>

        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <FaBell size={18} />
        </button>

        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1736926442592-8ca433aa1e19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MjR8fHxlbnwwfHx8fHw%3D"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
