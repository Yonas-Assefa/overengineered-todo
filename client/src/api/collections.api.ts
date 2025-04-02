import { CollectionSchema } from "../lib/schemas";
import { Collection } from "../types";
import { BASE_API_URL } from "../config/url.config";
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
