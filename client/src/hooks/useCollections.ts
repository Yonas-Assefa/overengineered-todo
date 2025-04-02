import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../api/collections.api";

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: 5 * 60 * 1000,
  });
};
