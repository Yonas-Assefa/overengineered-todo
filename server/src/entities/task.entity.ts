import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Collection } from "./collection.entity";

@Entity()
export class Task {
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

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => Collection, (collection) => collection.tasks)
  @JoinColumn({ name: "collection_id" })
  collection!: Collection;

  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true })
  parentTask?: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  subtasks!: Task[];
}
