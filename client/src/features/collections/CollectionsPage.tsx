import { useCollections } from "../../hooks/useCollections";
import { CollectionCard } from "../../components/CollectionCard";
import { useState } from "react";
import { AddCollectionModal } from "../../components/modals/AddCollectionModal";
import { EditCollectionModal } from "../../components/modals/EditCollectionModal";
import { DeleteCollectionModal } from "../../components/modals/DeleteCollectionModal";
import { useAddCollectionModal } from "../../hooks/useAddCollectionModal";
import { useCreateCollection } from "../../hooks/useCreateCollection";
import { useUpdateCollection } from "../../hooks/useUpdateCollection";
import { useDeleteCollection } from "../../hooks/useDeleteCollection";
import { Collection, CollectionFormData } from "../../types";
import { SubmitHandler } from "react-hook-form";

export const CollectionsPage = () => {
  const { data: collections, isLoading, error } = useCollections();
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites">("all");
  const { isOpen, openModal, closeModal } = useAddCollectionModal();
  const { mutate: createCollection } = useCreateCollection();
  const { mutate: updateCollection } = useUpdateCollection();
  const { mutate: deleteCollection } = useDeleteCollection();
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

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

  const handleEditCollection = (updatedCollection: Collection) => {
    updateCollection(updatedCollection);
    setCollectionToEdit(null);
  };

  const handleDeleteCollection = () => {
    if (!collectionToDelete) return;
    deleteCollection(collectionToDelete.id);
    setCollectionToDelete(null);
  };

  return (
    <div className="w-full min-h-screen p-8 bg-[#17181C] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <div className="flex items-center gap-4">
            {/* Add your notification and profile icons here */}
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === "favorites"
                ? "bg-[#25262C] text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("favorites")}
          >
            Favourites
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === "all"
                ? "bg-[#25262C] text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All Collections
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections?.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={(collection) => setCollectionToEdit(collection)}
              onDelete={(collection) => setCollectionToDelete(collection)}
            />
          ))}

          {activeFilter === "favorites" && filteredCollections?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              You don't have any favorite collections yet.
            </div>
          )}

          {activeFilter === "all" && (
            <button
              onClick={openModal}
              className="w-full aspect-square flex items-center justify-center rounded-2xl bg-[#1E1F25] cursor-pointer hover:bg-[#25262C] transition-all border-2 border-dashed border-gray-700"
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

      {collectionToEdit && (
        <EditCollectionModal
          collection={collectionToEdit}
          onClose={() => setCollectionToEdit(null)}
          onSave={handleEditCollection}
        />
      )}

      {collectionToDelete && (
        <DeleteCollectionModal
          collection={collectionToDelete}
          onConfirm={handleDeleteCollection}
          onCancel={() => setCollectionToDelete(null)}
        />
      )}
    </div>
  );
};
