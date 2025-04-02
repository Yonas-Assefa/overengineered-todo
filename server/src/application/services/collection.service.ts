  import { Collection } from "../../domain/entities/collection.entity";
  import type { ICollectionRepository } from "../../domain/interfaces/repository.interface";
  import type { CreateCollectionDto, UpdateCollectionDto } from "../dtos/collection.dto";

  export class CollectionService {
    constructor(private repository: ICollectionRepository) {}

    async createCollection(dto: CreateCollectionDto): Promise<Collection> {
      const collection = new Collection(0, dto.name, dto.isFavorite ?? false, new Date(), new Date());
      return this.repository.create(collection);
    }

    async getAllCollections(): Promise<Collection[]> {
      return this.repository.findAll();
    }

    async getCollectionById(id: number): Promise<Collection> {
      const collection = await this.repository.findById(id);
      if (!collection) throw new Error("Collection not found");
      return collection;
    }

    async updateCollection(id: number, dto: UpdateCollectionDto): Promise<Collection> {
      const collection = await this.getCollectionById(id);
      return this.repository.update(id, {
        ...collection,
        ...dto,
        updatedAt: new Date(),
      });
    }

    async deleteCollection(id: number): Promise<void> {
      await this.getCollectionById(id);
      return this.repository.delete(id);
    }
  }
