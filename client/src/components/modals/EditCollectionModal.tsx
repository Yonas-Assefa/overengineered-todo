import React, { useState } from 'react';
import { Collection } from '../../types';
import { FaStar } from 'react-icons/fa';

interface EditCollectionModalProps {
  collection: Collection;
  onClose: () => void;
  onSave: (collection: Collection) => void;
}

export const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  collection,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(collection.name);
  const [isFavorite, setIsFavorite] = useState(collection.isFavorite);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...collection,
      name: name.trim(),
      isFavorite,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E1F25] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Edit Collection</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Collection name"
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 text-sm font-medium ${
                isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
              } transition-colors`}
            >
              <FaStar size={16} />
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 