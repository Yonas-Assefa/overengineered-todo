import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import type { Collection } from "../types";
import { FaEllipsisV, FaStar, FaUsers, FaCheck } from "react-icons/fa";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get the appropriate icon and color based on collection name
  const getCollectionStyle = (name: string) => {
    switch (name.toLowerCase()) {
      case "school":
        return {
          icon: "📚",
          bgColor: "rgb(255, 129, 159)",
          textColor: "text-pink-100",
        };
      case "personal":
        return {
          icon: "👤",
          bgColor: "rgb(100, 223, 223)",
          textColor: "text-teal-100",
        };
      case "design":
        return {
          icon: "🎨",
          bgColor: "rgb(171, 146, 255)",
          textColor: "text-purple-100",
        };
      case "groceries":
        return {
          icon: "🛒",
          bgColor: "rgb(255, 198, 102)",
          textColor: "text-yellow-100",
        };
      default:
        return {
          icon: "📝",
          bgColor: "#8B5CF6",
          textColor: "text-purple-100",
        };
    }
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const style = getCollectionStyle(collection.name);
  const isComplete =
    collection.completedTasks === collection.totalTasks &&
    collection.totalTasks > 0;

  return (
    <div
      className="group relative p-6 bg-[#1E1F25] rounded-2xl cursor-pointer hover:bg-[#25262C] transition-all duration-200 h-[200px] flex flex-col justify-between"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest(".menu-container")) {
          navigate(`/collections/${collection.id}`);
        }
      }}
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Icon and Title */}
        <div>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-xl"
            style={{ backgroundColor: style.bgColor }}
          >
            {style.icon}
          </div>
          <h3 className="text-white text-xl font-medium">{collection.name}</h3>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {collection.completedTasks}/{collection.totalTasks} done
        </div>

        <div className="flex items-center gap-2">
          {/* Show users count if present */}
          {collection.sharedWith && collection.sharedWith.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#25262C]">
              <FaUsers size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">
                {collection.sharedWith.length}
              </span>
            </div>
          )}

          {/* Show completion indicator if all tasks are done */}
          {isComplete && (
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <FaCheck size={12} className="text-white" />
            </div>
          )}

          {/* Show progress indicator if not complete */}
          {!isComplete && collection.totalTasks > 0 && (
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{
                borderColor: style.bgColor,
                opacity: 0.6,
              }}
            ></div>
          )}
        </div>
      </div>

      {/* Menu Button - Only visible on hover */}
      <div className="menu-container absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2B31]"
        >
          <FaEllipsisV size={14} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-48 py-2 bg-[#25262C] rounded-lg shadow-lg z-10"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(collection);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#1E1F25] hover:text-white transition-colors"
            >
              Edit Collection
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(collection);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#1E1F25] hover:text-red-400 transition-colors"
            >
              Delete Collection
            </button>
          </div>
        )}
      </div>

      {/* Favorite Star - Only show if favorited */}
      {collection.isFavorite && (
        <div className="absolute top-4 right-14 text-yellow-400">
          <FaStar size={16} />
        </div>
      )}
    </div>
  );
};
