import { Link, useParams } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { useCollections } from "../../hooks/useCollections";
import { ErrorDisplay } from "../ErrorDisplay";

export const Sidebar = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { data: collections, isLoading, error } = useCollections();

  if (isLoading) return <div className="text-white p-4">Loading...</div>;
  if (error)
    return (
      <div className="w-64 bg-gray-800 h-screen p-4 overflow-y-auto">
        <ErrorDisplay error={error} className="min-h-[100px]" />
      </div>
    );

  return (
    <div className="w-64 bg-gray-800 h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-4 mt-4">
        Collections
      </h2>
      <ul className="space-y-2">
        {collections?.map((collection) => (
          <li key={collection.id}>
            <Link
              to={`/collections/${collection.id}`}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                Number(collectionId) === collection.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaFolder
                size={18}
                className={
                  Number(collectionId) === collection.id
                    ? "text-pink-500"
                    : "text-gray-400"
                }
              />
              {collection.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
