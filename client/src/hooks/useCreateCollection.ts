import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "../api/collections.api";
import { CollectionFormData } from "../types";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CollectionFormData) => createCollection(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
