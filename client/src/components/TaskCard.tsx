import { useState } from "react";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const handleSave = () => {
    onUpdate({ ...task, title });
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg flex items-center gap-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        className="w-5 h-5"
      />
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-pink-500 text-white rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex-1">
          <h4
            className={`text-white ${task.completed ? "line-through" : ""}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </h4>
          <p className="text-gray-400">
            {new Date(task.date).toLocaleDateString()}
          </p>
        </div>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
};
