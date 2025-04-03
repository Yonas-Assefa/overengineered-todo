import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Collection } from "../types";
import { updateCollection as updateCollectionApi } from "../api/collections.api";

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collection: Collection) => updateCollectionApi(collection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}; 