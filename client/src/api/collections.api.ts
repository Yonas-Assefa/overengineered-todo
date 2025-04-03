import { CollectionSchema } from "../lib/schemas";
import { Collection } from "../types";
import { BASE_API_URL } from "../config/url.config";
import { excludeFields } from "../utils/excludeFields";
export const fetchCollections = async (): Promise<Collection[]> => {
  const response = await fetch(`${BASE_API_URL}/collections`);
  const data = await response.json();
  console.log({ data });
  return CollectionSchema.array().parse(data);
};

export const createCollection = async (values: {
  name: string;
  isFavorite: boolean;
}) => {
  const response = await fetch(`${BASE_API_URL}/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();
  return CollectionSchema.parse(data);
};

export const fetchCollection = async (
  collectionId: number
): Promise<{ id: number; name: string }> => {
  const response = await fetch(`${BASE_API_URL}/collections/${collectionId}`);
  const data = await response.json();
  return data;
};

export const updateCollection = async (collection: Collection): Promise<Collection> => {
  const payload = excludeFields(collection, ['id', 'createdAt', 'updatedAt']);
  const response = await fetch(`${BASE_API_URL}/collections/${collection.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update collection");
  }

  return response.json();
};

export const deleteCollection = async (collectionId: number): Promise<void> => {
  const response = await fetch(`${BASE_API_URL}/collections/${collectionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete collection");
  }
};
