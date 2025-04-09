import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../api/collections.api";
import { STALE_TIME } from "../config/app.config";

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
    staleTime: STALE_TIME,
  });
};
