import { useCollections } from "../../hooks/useCollections";
import { CollectionCard } from "../../components/CollectionCard";

export const CollectionsPage: React.FC = () => {
  const { data: collections, isLoading, error } = useCollections();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="flex w-full">
      <div className="flex-1 p-8">
        <div className="mt-8">
          <h1 className="text-2xl text-white mb-4">Collections</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections?.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
