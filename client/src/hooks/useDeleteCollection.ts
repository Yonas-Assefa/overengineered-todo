import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCollection as deleteCollectionApi } from "../api/collections.api";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: number) => deleteCollectionApi(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}; 