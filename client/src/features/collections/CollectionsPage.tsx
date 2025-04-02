import { useCollections } from "../../hooks/useCollections";
import { CollectionCard } from "../../components/CollectionCard";
import { useState } from "react";
import { AddCollectionModal } from "../../components/modals/AddCollectionModal";
import { useAddCollectionModal } from "../../hooks/useAddCollectionModal";
import { useCreateCollection } from "../../hooks/useCreateCollection";
import { CollectionFormData } from "../../types";
import { SubmitHandler } from "react-hook-form";

export const CollectionsPage = () => {
  const { data: collections, isLoading, error } = useCollections();
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites">("all");
  const { isOpen, openModal, closeModal } = useAddCollectionModal();
  const { mutate: createCollection } = useCreateCollection();

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500">Error: {(error as Error).message}</div>
    );

  const filteredCollections =
    activeFilter === "favorites"
      ? collections?.filter((collection) => collection.isFavorite)
      : collections;

  const handleCreateCollection: SubmitHandler<CollectionFormData> = (data) => {
    createCollection(data);
  };

  return (
    <div className="w-full min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Collections</h1>
        </div>

        <div className="flex gap-3 mt-18 mb-10">
          <button
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeFilter === "favorites"
                ? "bg-gray-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveFilter("favorites")}
          >
            Favorites
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeFilter === "all"
                ? "bg-gray-500"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All Collections
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCollections?.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}

          {activeFilter === "favorites" &&
            filteredCollections?.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                You don't have any favorite collections yet.
              </div>
            )}

          {activeFilter === "all" && (
            <button
              onClick={openModal}
              className="w-full aspect-square flex items-center justify-center rounded-xl bg-gray-900 cursor-pointer hover:bg-gray-800 transition-all"
            >
              <span className="text-gray-400 text-3xl">+</span>
            </button>
          )}
        </div>
      </div>

      <AddCollectionModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleCreateCollection}
      />
    </div>
  );
};
