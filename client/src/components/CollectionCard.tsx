import { useNavigate } from "react-router-dom";
import type { Collection } from "../types";

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
      onClick={() => navigate(`/collections/${collection.id}`)}
    >
      <div className="flex items-center gap-2">
        <span className="text-pink-500">📌</span>
        <h3 className="text-white capitalize">{collection.name}</h3>
      </div>
    </div>
  );
};
