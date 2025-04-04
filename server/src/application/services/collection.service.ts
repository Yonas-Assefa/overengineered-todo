import { Collection } from "../../domain/entities/collection.entity";
import type { ICollectionRepository } from "../../domain/interfaces/repository.interface";
import type { CreateCollectionDto, UpdateCollectionDto } from "../dtos/collection.dto";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export class CollectionService {
  private taskRepository: TaskRepository;

  constructor(
    private repository: ICollectionRepository,
  ) {
    this.taskRepository = new TaskRepository();
  }

  async createCollection(dto: CreateCollectionDto): Promise<Collection> {
    const collection = new Collection(0, dto.name, dto.isFavorite ?? false, new Date(), new Date());
    return this.repository.create(collection);
  }

  private async addTaskStats(collection: Collection): Promise<Collection & { completedTasks: number; totalTasks: number }> {
    const tasks = await this.taskRepository.findByCollectionId(collection.id);
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    
    return {
      ...collection,
      completedTasks,
      totalTasks
    };
  }

  async getAllCollections(): Promise<Array<Collection & { completedTasks: number; totalTasks: number }>> {
    const collections = await this.repository.findAll();
    return Promise.all(collections.map(collection => this.addTaskStats(collection)));
  }

  async getCollectionById(id: number): Promise<Collection & { completedTasks: number; totalTasks: number }> {
    const collection = await this.repository.findById(id);
    if (!collection) throw new Error("Collection not found");
    return this.addTaskStats(collection);
  }

  async updateCollection(id: number, dto: UpdateCollectionDto): Promise<Collection & { completedTasks: number; totalTasks: number }> {
    const collection = await this.getCollectionById(id);
    const updated = await this.repository.update(id, {
      ...collection,
      ...dto,
      updatedAt: new Date(),
    });
    return this.addTaskStats(updated);
  }

  async deleteCollection(id: number): Promise<void> {
    await this.getCollectionById(id);
    return this.repository.delete(id);
  }
}
