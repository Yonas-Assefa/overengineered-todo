// src/components/Sidebar.tsx
import { Link } from "react-router-dom";

export const Sidebar = () => (
  <div className="w-64 h-full bg-gray-800 p-4">
    <Link to="/" className="block text-white mb-4">
      Collections
    </Link>
  </div>
);
