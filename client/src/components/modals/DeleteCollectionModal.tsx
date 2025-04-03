import React from 'react';
import { Collection } from '../../types';

interface DeleteCollectionModalProps {
  collection: Collection;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  collection,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E1F25] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Collection</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete "{collection.name}"? This action cannot be undone and will delete all tasks within this collection.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}; 