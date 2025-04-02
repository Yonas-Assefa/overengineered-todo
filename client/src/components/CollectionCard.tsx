import { useNavigate } from "react-router-dom";
import type { Collection } from "../types";

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
}) => {
  const navigate = useNavigate();

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

  return (
    <div
      className="relative p-6 bg-[#1E1F25] rounded-2xl cursor-pointer hover:bg-[#25262C] transition-all duration-200"
      onClick={() => navigate(`/collections/${collection.id}`)}
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

      {/* Favorite Star - Only show if favorited */}
      {collection.isFavorite && (
        <div className="absolute top-4 right-4 text-yellow-400">
          ⭐
        </div>
      )}
    </div>
  );
};
