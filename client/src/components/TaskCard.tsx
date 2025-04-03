import { useState, useRef, useEffect } from "react";
import type { Task } from "../types";
import { FaChevronDown, FaChevronUp, FaEllipsisV } from "react-icons/fa";

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
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleComplete = () => {
    onUpdate({ ...task, completed: !task.completed });
  };

  const handleTouchStart = () => {
    touchStartTime.current = Date.now();
    const timer = window.setTimeout(() => {
      onDelete(task.id);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime.current;
    if (longPressTimer) {
      window.clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    // If touch duration is short, treat it as a normal click
    if (touchDuration < 500) {
      setIsExpanded(!isExpanded);
    }
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div 
      className={`group transition-all duration-200 ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      <div
        className="p-4 bg-[#1E1F25] rounded-xl flex items-start gap-3 cursor-pointer hover:bg-[#25262C]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={() => onEdit(task)}
      >
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="w-5 h-5 rounded-full border-2 border-pink-500 checked:bg-pink-500 checked:border-pink-500 focus:ring-pink-500 focus:ring-offset-0"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <div className={`text-base ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
              {task.title}
            </div>
            <div className="text-sm text-gray-500">
              {task.date === 'Today' ? (
                <span className="text-pink-500">Today</span>
              ) : (
                task.date
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaEllipsisV size={14} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 w-48 py-2 bg-[#25262C] rounded-lg shadow-lg z-10"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#1E1F25] hover:text-white transition-colors"
              >
                Edit Task
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-[#1E1F25] hover:text-red-400 transition-colors"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
      </div>

      {/* Subtasks will be added here later */}
    </div>
  );
};
