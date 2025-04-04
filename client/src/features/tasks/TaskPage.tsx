// TasksPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { TaskCard } from "../../components/TaskCard";
import { useState, useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdArrowBackIos, MdMoreVert } from "react-icons/md";
import { Sidebar } from "../../components/layouts/Sidebar";
import { DeleteConfirmationModal } from "../../components/modals/DeleteConfirmationModal";
import { TaskEditModal } from "../../components/modals/TaskEditModal";
import { CreateTaskModal } from "../../components/modals/CreateTaskModal";
import { Task } from "../../types";

export const TasksPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { tasksQuery, collectionQuery, createTask, updateTask, deleteTask } =
    useTasks(Number(collectionId));

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks
  } = tasksQuery;
  const {
    data: collection,
    isLoading: collectionLoading,
    error: collectionError,
  } = collectionQuery;

  // Refetch tasks when the modal is closed after creating a task
  useEffect(() => {
    if (!showCreateTaskModal && tasks) {
      refetchTasks();
    }
  }, [showCreateTaskModal, refetchTasks, tasks]);

  const handleCreateTask = async (taskData: { title: string; date: string }) => {
    try {
      await createTask({
        title: taskData.title,
        date: taskData.date,
        completed: false,
        collectionId: Number(collectionId),
      });
      // Close the modal after successful creation
      setShowCreateTaskModal(false);
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
      console.log("handleUpdateTask - updatedTask:", updatedTask);
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
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center gap-2 text-sm font-medium mb-8 text-gray-400 hover:text-white transition-colors"
          >
            <FaPlus size={12} className="text-pink-500" />
            Add a task
          </button>

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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};
