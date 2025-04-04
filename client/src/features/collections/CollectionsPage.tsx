import { useCollections } from "../../hooks/useCollections";
import { CollectionCard } from "../../components/CollectionCard";
import { CollectionSkeleton } from "../../components/CollectionSkeleton";
import { useState, useRef, useEffect } from "react";
import { AddCollectionModal } from "../../components/modals/AddCollectionModal";
import { EditCollectionModal } from "../../components/modals/EditCollectionModal";
import { DeleteCollectionModal } from "../../components/modals/DeleteCollectionModal";
import { CreateTaskModal } from "../../components/modals/CreateTaskModal";
import { useAddCollectionModal } from "../../hooks/useAddCollectionModal";
import { useCreateCollection } from "../../hooks/useCreateCollection";
import { useUpdateCollection } from "../../hooks/useUpdateCollection";
import { useDeleteCollection } from "../../hooks/useDeleteCollection";
import { useCreateTask } from "../../hooks/useCreateTask";
import { Collection, CollectionFormData } from "../../types";
import { SubmitHandler } from "react-hook-form";
import { FaEllipsisV } from "react-icons/fa";

export const CollectionsPage = () => {
  const { data: collections, isLoading, error } = useCollections();
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites">("all");
  const { isOpen, openModal, closeModal } = useAddCollectionModal();
  const { mutate: createCollection } = useCreateCollection();
  const { mutate: updateCollection } = useUpdateCollection();
  const { mutate: deleteCollection } = useDeleteCollection();
  const { mutate: createTask } = useCreateTask();
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

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

  const handleCreateTask = async (taskData: { title: string; date: string; collectionId?: number }) => {
    if (!taskData.collectionId) return;
    
    try {
      await createTask({
        title: taskData.title,
        date: taskData.date,
        completed: false,
        collectionId: taskData.collectionId,
      });
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="w-full min-h-screen p-8 bg-[#17181C] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Collections</h1>
          <div className="flex items-center gap-4">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2B31]"
              >
                <FaEllipsisV size={14} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-[#25262C] rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowCreateTaskModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#1E1F25] hover:text-white transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              )}
            </div>
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
          {isLoading ? (
            <>
              <CollectionSkeleton />
              <CollectionSkeleton />
              <CollectionSkeleton />
              <CollectionSkeleton />
              <CollectionSkeleton />
              <CollectionSkeleton />
            </>
          ) : (
            <>
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
                  className="w-full h-[200px] flex items-center justify-center rounded-2xl bg-[#1E1F25] cursor-pointer hover:bg-[#25262C] transition-all border-2 border-dashed border-gray-700"
                >
                  <span className="text-gray-400 text-3xl">+</span>
                </button>
              )}
            </>
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

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        collections={collections || []}
      />
    </div>
  );
};
