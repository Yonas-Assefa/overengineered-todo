import React, { useState } from 'react';
import { Task } from '../../types';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(task.title);
  const [completed, setCompleted] = useState(task.completed);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title,
      completed,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1E1F25] rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-6">Edit Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Task title"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-5 h-5 rounded-full border-2 border-pink-500 checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500 focus:ring-offset-0"
            />
            <label className="ml-2 text-gray-400">
              Mark as completed
            </label>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Subtasks</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Add a subtask"
              />
              <button
                type="button"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between p-3 bg-[#17181C] rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      className="w-4 h-4 rounded-full border-2 border-pink-500 checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500 focus:ring-offset-0"
                    />
                    <span className="text-gray-300">{subtask.title}</span>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 