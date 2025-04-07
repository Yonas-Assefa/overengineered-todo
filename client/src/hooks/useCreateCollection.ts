import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "../api/collections.api";
import { CollectionFormData, Collection } from "../types";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CollectionFormData) => createCollection(values),
    onMutate: async (newCollection) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["collections"] });

      // Snapshot the previous value
      const previousCollections = queryClient.getQueryData<Collection[]>(["collections"]) || [];

      // Optimistically update to the new value
      const optimisticCollection: Collection = {
        id: Date.now(), // temporary ID
        name: newCollection.name,
        isFavorite: newCollection.isFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedTasks: 0,
        totalTasks: 0,
      };

      queryClient.setQueryData(["collections"], [...previousCollections, optimisticCollection]);

      return { previousCollections };
    },
    onError: (_err, _newCollection, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCollections) {
        queryClient.setQueryData(["collections"], context.previousCollections);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
