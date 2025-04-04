import { useState, useRef, useEffect } from "react";
import type { Task } from "../types";
import { FaChevronDown, FaChevronUp, FaEllipsisV } from "react-icons/fa";
import { format, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTask, setLocalTask] = useState<Task>(task);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const handleToggleComplete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    const updatedTask = {
      ...localTask,
      completed: !localTask.completed,
      subtasks: localTask.subtasks?.map(subtask => ({
        ...subtask,
        completed: !localTask.completed
      }))
    };
    
    setLocalTask(updatedTask);
    
    try {
      await onUpdate(updatedTask);
    } catch (error) {
      setLocalTask(task);
      console.error("Failed to update task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskDate = new Date(date);
      taskDate.setHours(0, 0, 0, 0);
      
      if (taskDate.getTime() === today.getTime()) {
        return <span className="text-pink-500">Today</span>;
      }
      
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div 
      className="group transition-all duration-200"
    >
      <div
        className={`p-4 bg-[#1E1F25] rounded-xl flex items-start gap-3 cursor-pointer ${
          !localTask.completed ? 'hover:bg-[#25262C]' : ''
        } transition-colors duration-200 ${
          isUpdating ? 'pointer-events-none' : ''
        }`}
        onDoubleClick={() => onEdit(localTask)}
      >
        <button
          onClick={handleToggleComplete}
          disabled={isUpdating}
          className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            localTask.completed ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'
          } ${isUpdating ? 'opacity-75' : ''}`}
        >
          {localTask.completed ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
              <path d="M16.5 8.5L10.5 14.5L7.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <div className={`text-base transition-all duration-200 ${
              localTask.completed ? "text-gray-500 line-through opacity-50" : "text-white"
            }`}>
              {localTask.title}
            </div>
            <div className={`text-sm text-gray-500 ${localTask.completed ? "opacity-50" : ""}`}>
              {formatDate(localTask.date)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              disabled={isUpdating}
              className={`p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2B31] ${
                isUpdating ? 'opacity-75' : ''
              }`}
            >
              <FaEllipsisV size={14} />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-1 w-48 py-2 bg-[#25262C] rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(localTask);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#1E1F25] hover:text-white transition-colors"
                >
                  Edit Task
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(localTask.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#1E1F25] hover:text-red-400 transition-colors"
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>

          {localTask.subtasks && localTask.subtasks.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isUpdating}
              className={`p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2B31] ${
                isUpdating ? 'opacity-75' : ''
              }`}
            >
              {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && localTask.subtasks && localTask.subtasks.length > 0 && (
        <div className="mt-2 space-y-2 pl-8">
          {localTask.subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-3 bg-[#25262C] rounded-lg"
            >
              <div className="relative w-5 h-5 rounded-full flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className={`text-sm transition-all duration-200 ${
                localTask.completed ? "text-gray-500 line-through opacity-50" : "text-gray-300"
              }`}>
                {subtask.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
