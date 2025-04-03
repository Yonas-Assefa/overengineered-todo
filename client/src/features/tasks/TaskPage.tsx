// TasksPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { TaskCard } from "../../components/TaskCard";
import { useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { MdArrowBackIos, MdMoreVert } from "react-icons/md";
import { Sidebar } from "../../components/layouts/Sidebar";
import { DeleteConfirmationModal } from "../../components/modals/DeleteConfirmationModal";
import { TaskEditModal } from "../../components/modals/TaskEditModal";
import { Task } from "../../types";

export const TasksPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { tasksQuery, collectionQuery, createTask, updateTask, deleteTask } =
    useTasks(Number(collectionId));

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = tasksQuery;
  const {
    data: collection,
    isLoading: collectionLoading,
    error: collectionError,
  } = collectionQuery;

  const handleCreateTask = async (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        title: newTaskTitle,
        date: "Today",
        completed: false,
        collectionId: Number(collectionId),
      });
      setNewTaskTitle("");
      setShowAddTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Memoize the update handler to prevent unnecessary re-renders
  const handleUpdateTask = useCallback(async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }, [updateTask]);

  const activeTasks = tasks?.filter((task) => !task.completed) || [];
  const completedTasks = tasks?.filter((task) => task.completed) || [];

  if (tasksLoading || collectionLoading)
    return <div className="text-white">Loading...</div>;
  if (tasksError || collectionError)
    return <div className="text-red-500">Error loading tasks</div>;

  return (
    <div className="flex min-h-screen bg-[#17181C]">
      <Sidebar />
      <div className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-white hover:text-pink-500 transition-colors"
              >
                <MdArrowBackIos size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-white">{collection?.name}</h1>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MdMoreVert size={24} />
            </button>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className={`flex items-center gap-2 text-sm font-medium mb-8 ${
              showAddTask ? "text-pink-500" : "text-gray-400 hover:text-white"
            } transition-colors`}
          >
            <FaPlus size={12} className="text-pink-500" />
            Add a task
          </button>

          {showAddTask && (
            <div className="mb-8">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleCreateTask}
                onBlur={() => newTaskTitle.trim() && handleCreateTask()}
                placeholder="Task name"
                className="w-full p-4 bg-[#1E1F25] text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                autoFocus
              />
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-4">
                Tasks - {activeTasks.length}
              </h2>
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={(taskId) => {
                      const taskToDelete = tasks?.find(t => t.id === taskId);
                      if (taskToDelete) {
                        setTaskToDelete(taskToDelete);
                      }
                    }}
                    onEdit={(task) => setTaskToEdit(task)}
                  />
                ))}
              </div>
            </div>

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4">
                  Completed - {completedTasks.length}
                </h2>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={(taskId) => {
                        const taskToDelete = tasks?.find(t => t.id === taskId);
                        if (taskToDelete) {
                          setTaskToDelete(taskToDelete);
                        }
                      }}
                      onEdit={(task) => setTaskToEdit(task)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <DeleteConfirmationModal
          taskTitle={taskToDelete.title}
          onConfirm={() => handleDeleteTask(taskToDelete.id)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {/* Edit Task Modal */}
      {taskToEdit && (
        <TaskEditModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onSave={handleUpdateTask}
        />
      )}
    </div>
  );
};
