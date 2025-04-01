export interface CreateCollectionDto {
  name: string;
  isFavorite?: boolean;
}

export interface UpdateCollectionDto {
  name?: string;
  isFavorite?: boolean;
}
