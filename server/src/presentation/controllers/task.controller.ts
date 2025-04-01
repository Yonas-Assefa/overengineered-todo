import type { NextFunction, Request, Response } from "express";
import type { CreateTaskDto, UpdateTaskDto } from "../../application/dtos/task.dto";
import type { TaskService } from "../../application/services/task.service";

export class TaskController {
  constructor(private service: TaskService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateTaskDto = req.body;
      const task = await this.service.createTask(dto);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const task = await this.service.getTaskById(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  findByCollectionId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const collectionId = Number.parseInt(req.params.collectionId);
      const tasks = await this.service.getTasksByCollectionId(collectionId);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      const dto: UpdateTaskDto = req.body;
      const task = await this.service.updateTask(id, dto);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number.parseInt(req.params.id);
      await this.service.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
