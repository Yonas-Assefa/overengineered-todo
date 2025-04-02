import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CollectionEntity } from "./collection.entity";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "datetime" })
  date!: Date;

  @Column({ default: false })
  completed!: boolean;

  @Column({ default: false })
  isRecurring!: boolean;

  @Column({ nullable: true })
  recurrencePattern?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => CollectionEntity, (collection) => collection.tasks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "collection_id" })
  collection!: CollectionEntity;

  @ManyToOne(() => TaskEntity, (task) => task.subtasks, { nullable: true })
  @JoinColumn({ name: "parent_task_id" })
  parentTask?: TaskEntity;

  @OneToMany(() => TaskEntity, (task) => task.parentTask)
  subtasks!: TaskEntity[];
}
