import { Request, Response, NextFunction } from "express";
import { CollectionService } from "../../application/services/collection.service";
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from "../../application/dtos/collection.dto";

export class CollectionController {
  constructor(private service: CollectionService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateCollectionDto = req.body;
      const collection = await this.service.createCollection(dto);
      res.status(201).json(collection);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const collections = await this.service.getAllCollections();
      res.json(collections);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const collection = await this.service.getCollectionById(id);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateCollectionDto = req.body;
      const collection = await this.service.updateCollection(id, dto);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteCollection(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
