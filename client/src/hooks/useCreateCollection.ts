import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "../api/collections.api";
import { CollectionFormData, Collection } from "../types";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CollectionFormData) => createCollection(values),
    onMutate: async (newCollection) => {
      await queryClient.cancelQueries({ queryKey: ["collections"] });

      const previousCollections =
        queryClient.getQueryData<Collection[]>(["collections"]) || [];

      const optimisticCollection: Collection = {
        id: Date.now(),
        name: newCollection.name,
        isFavorite: newCollection.isFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedTasks: 0,
        totalTasks: 0,
      };

      queryClient.setQueryData(
        ["collections"],
        [...previousCollections, optimisticCollection]
      );

      return { previousCollections };
    },
    onError: (_err, _newCollection, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(["collections"], context.previousCollections);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
