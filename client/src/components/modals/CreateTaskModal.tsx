import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Collection } from "../../types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: { title: string; date: string; collectionId?: number }) => void;
  collections?: Collection[];
  defaultCollectionId?: number;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  collections,
  defaultCollectionId,
}) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | undefined>(
    defaultCollectionId || collections?.[0]?.id
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDueDate(format(new Date(), "yyyy-MM-dd"));
      setSelectedCollectionId(defaultCollectionId || collections?.[0]?.id);
      setIsSubmitting(false);
    }
  }, [isOpen, collections, defaultCollectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formattedDate = new Date(dueDate).toISOString();
      await onSubmit({
        title: title.trim(),
        date: formattedDate,
        ...(selectedCollectionId && { collectionId: selectedCollectionId }),
      });
      onClose();
    } catch (error) {
      console.error("Failed to create task:", error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E1F25] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">
          Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
              placeholder="Enter task title"
              autoFocus
            />
          </div>

          {collections && collections.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Collection
              </label>
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
                disabled={isSubmitting}
                className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-75"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-75"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
