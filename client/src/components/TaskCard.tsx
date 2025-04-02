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
    <div className="p-3 bg-[#2c2d31] rounded-lg flex items-center gap-3 group hover:bg-[#363739] transition-colors">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        className="w-4 h-4 rounded-full border-2 border-gray-600 checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500 focus:ring-offset-0"
      />
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 bg-[#1a1b1e] text-white rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-pink-500 text-white text-sm rounded-md hover:bg-pink-600 transition-colors"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <div
            className={`text-sm ${
              task.completed ? "text-gray-500 line-through" : "text-white"
            } truncate cursor-pointer`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(task.date).toLocaleDateString()}
          </div>
        </div>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-gray-400 hover:text-white transition-all"
      >
        Delete
      </button>
    </div>
  );
};
