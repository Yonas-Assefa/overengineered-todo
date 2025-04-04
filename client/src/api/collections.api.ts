import { Collection } from "../types";
import axiosInstance from "../lib/axios";
import { excludeFields } from "../utils/excludeFields";

export const fetchCollections = async (): Promise<Collection[]> => {
  const { data } = await axiosInstance.get("/collections");
  return data;
};

export const createCollection = async (values: {
  name: string;
  isFavorite: boolean;
}): Promise<Collection> => {
  const { data } = await axiosInstance.post("/collections", values);
  return data;
};

export const fetchCollection = async (
  collectionId: number
): Promise<Collection> => {
  const { data } = await axiosInstance.get(`/collections/${collectionId}`);
  return data;
};

export const updateCollection = async (
  collection: Collection
): Promise<Collection> => {
  const payload = excludeFields(collection, [
    "id",
    "completedTasks",
    "totalTasks",
    "createdAt",
    "updatedAt",
  ]);
  const { data } = await axiosInstance.patch(
    `/collections/${collection.id}`,
    payload
  );
  return data;
};

export const deleteCollection = async (collectionId: number): Promise<void> => {
  await axiosInstance.delete(`/collections/${collectionId}`);
};
