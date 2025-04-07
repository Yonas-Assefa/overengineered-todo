import React, { useState, useRef, useEffect } from "react";
import { Task, Subtask } from "../../types";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import {
  createSubtask,
  updateSubtask,
  deleteSubtask,
  getSubtasksByTaskId,
} from "../../api/tasks.api";

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
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [editingSubtask, setEditingSubtask] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dueDate, setDueDate] = useState(() => {
    try {
      return format(parseISO(task.date), "yyyy-MM-dd");
    } catch (error) {
      console.error("Error parsing date:", error);
      return format(new Date(), "yyyy-MM-dd");
    }
  });
  const saveTimeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    setTitle(task.title);
    setCompleted(task.completed);
    setSubtasks(task.subtasks || []);
    try {
      setDueDate(format(parseISO(task.date), "yyyy-MM-dd"));
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  }, [task]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const formattedDate = new Date(dueDate).toISOString();
      const updatedTask = {
        ...task,
        title: title.trim(),
        date: formattedDate,
        completed,
        subtasks,
      };

      await onSave(updatedTask);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const newSubtask = await createSubtask(task.id, newSubtaskTitle.trim());

      setSubtasks((prev) => [...(prev || []), newSubtask]);
      setNewSubtaskTitle("");
    } catch (error) {
      console.error("Error adding subtask:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSubtask = async (
    subtaskId: number,
    changes: Partial<Subtask>
  ) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateSubtask(task.id, subtaskId, changes.title || "");

      // Fetch updated subtasks after update
      const updatedSubtasks = await getSubtasksByTaskId(task.id);
      setSubtasks(updatedSubtasks);
    } catch (error) {
      console.error("Error updating subtask:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await deleteSubtask(task.id, subtaskId);
      setSubtasks(subtasks.filter((st) => st.id !== subtaskId));
    } catch (error) {
      console.error("Error deleting subtask:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleEditSubtaskSubmit = async () => {
    if (!editingSubtask || !editingSubtask.title.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await updateSubtask(
        task.id,
        editingSubtask.id,
        editingSubtask.title.trim()
      );

      const updatedSubtasks = await getSubtasksByTaskId(task.id);
      setSubtasks(updatedSubtasks);
      setEditingSubtask(null);
    } catch (error) {
      console.error("Error updating subtask:", error);
    } finally {
      setIsSaving(false);
    }
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
              disabled={isSaving}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSaving}
              className="w-full p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setCompleted(!completed)}
              disabled={isSaving}
              className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                completed
                  ? "bg-pink-500 border-pink-500"
                  : "border-pink-500 hover:border-pink-400"
              } disabled:opacity-75`}
            >
              {completed && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <label className="ml-2 text-gray-400">Mark as completed</label>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">Subtasks</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                  disabled={isSaving}
                  className="flex-1 p-3 bg-[#17181C] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
                  placeholder="Add a subtask"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={isSaving}
                  className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-75"
                >
                  <FaPlus size={14} />
                </button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 bg-[#17181C] rounded-lg group"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateSubtask(subtask.id, {
                          completed: !subtask.completed,
                        })
                      }
                      disabled
                      className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        subtask.completed
                          ? "text-pink-500"
                          : "text-gray-400 hover:text-pink-400"
                      } disabled:opacity-75`}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>

                    {editingSubtask?.id === subtask.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingSubtask.title}
                          onChange={(e) =>
                            setEditingSubtask({
                              ...editingSubtask,
                              title: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEditSubtaskSubmit()
                          }
                          disabled={isSaving}
                          className="flex-1 p-2 bg-[#1E1F25] text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-75"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleEditSubtaskSubmit}
                          disabled={isSaving}
                          className="p-2 text-pink-500 hover:text-pink-400 transition-colors disabled:opacity-75"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 text-sm ${
                            subtask.completed
                              ? "text-gray-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {subtask.title}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSubtask({
                                id: subtask.id,
                                title: subtask.title,
                              })
                            }
                            disabled={isSaving}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2B31] disabled:opacity-75"
                          >
                            <FaPen size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            disabled={isSaving}
                            className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-lg hover:bg-[#2A2B31] disabled:opacity-75"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-75"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-75"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
