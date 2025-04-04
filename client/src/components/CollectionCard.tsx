import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import type { Collection } from "../types";
import { FaEllipsisV, FaStar } from "react-icons/fa";

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

  // Calculate completion percentage
  const completionPercentage = Math.round((collection.completedTasks / collection.totalTasks) * 100) || 0;

  // Get the appropriate icon based on collection name
  const getCollectionIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'school':
        return '📚';
      case 'personal':
        return '👤';
      case 'design':
        return '🎨';
      case 'groceries':
        return '🛒';
      default:
        return '📝';
    }
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div
      className="group relative p-6 bg-[#1E1F25] rounded-2xl cursor-pointer hover:bg-[#25262C] transition-all duration-200 h-[200px]"
      onClick={(e) => {
        // Only navigate if not clicking the menu
        if (!(e.target as HTMLElement).closest('.menu-container')) {
          navigate(`/collections/${collection.id}`);
        }
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-opacity-20 rounded-xl"
               style={{ backgroundColor: collection.iconBg || '#2A2B31' }}>
            <span className="text-xl">{getCollectionIcon(collection.name)}</span>
          </div>
          <h3 className="text-white text-lg font-medium capitalize">{collection.name}</h3>
        </div>

        {/* Task Count */}
        <div className="text-sm text-gray-400">
          {collection.completedTasks}/{collection.totalTasks} done
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-[#2A2B31] rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: collection.progressColor || '#8B5CF6'
            }}
          />
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
