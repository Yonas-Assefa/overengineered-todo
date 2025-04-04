import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { CollectionFormData } from "../../types";
import { collectionFormSchema } from "../../lib/schemas";

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<CollectionFormData>;
}

export const AddCollectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddCollectionModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      isFavorite: false,
    },
  });

  const onFormSubmit: SubmitHandler<CollectionFormData> = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E1F25] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">
          Create New Collection
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Collection Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter collection name"
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFavorite"
              {...register("isFavorite")}
              className="h-4 w-4 rounded border-gray-700 bg-[#17181C] text-pink-500 focus:ring-pink-500"
            />
            <label htmlFor="isFavorite" className="ml-2 text-sm text-gray-400">
              Add to favorites
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
