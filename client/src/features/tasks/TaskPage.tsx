import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { TaskCard } from "../../components/TaskCard";
import { TaskSkeleton } from "../../components/TaskSkeleton";
import { useState, useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { MdArrowBackIos, MdMoreVert } from "react-icons/md";
import { Sidebar } from "../../components/layouts/Sidebar";
import { DeleteConfirmationModal } from "../../components/modals/DeleteConfirmationModal";
import { TaskEditModal } from "../../components/modals/TaskEditModal";
import { CreateTaskModal } from "../../components/modals/CreateTaskModal";
import { Task } from "../../types";
import { ErrorDisplay } from "../../components/ErrorDisplay";

export const TasksPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  
  if (!collectionId) {
    return (
      <div className="w-full min-h-screen p-8 bg-[#17181C] text-white">
        <div className="max-w-6xl mx-auto">
          <ErrorDisplay error="Invalid collection ID" />
        </div>
      </div>
    );
  }

  const { tasks, isLoading: tasksLoading, error: tasksError, createTask, updateTask, deleteTask, collection } = useTasks(Number(collectionId));

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateTask = async (taskData: {
    title: string;
    date: string;
  }) => {
    try {
      await createTask({
        title: taskData.title,
        date: taskData.date,
        completed: false,
        collectionId: Number(collectionId),
      });
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

  const handleUpdateTask = useCallback(
    async (updatedTask: Task) => {
      try {
        await updateTask(updatedTask);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    },
    [updateTask]
  );

  const activeTasks = tasks?.filter((task) => !task.completed) || [];
  const completedTasks = tasks?.filter((task) => task.completed) || [];

  if (tasksError)
    return (
      <div className="w-full min-h-screen p-8 bg-[#17181C] text-white">
        <div className="max-w-6xl mx-auto">
          <ErrorDisplay error={tasksError || 'An error occurred while loading tasks'} />
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#17181C]">
      <div className={`${showSidebar ? "block" : "hidden"} md:block`}>
        <Sidebar />
      </div>

      <div className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setShowSidebar(!showSidebar);
                  } else {
                    navigate("/");
                  }
                }}
                className="text-white hover:text-pink-500 transition-colors"
              >
                <MdArrowBackIos size={20} />
              </button>
              <h1 className="text-2xl font-semibold text-white">
                {tasksLoading ? (
                  <div className="h-8 w-32 bg-[#25262C] rounded-lg animate-pulse"></div>
                ) : (
                  collection?.name
                )}
              </h1>
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
                Tasks - {tasksLoading ? "..." : activeTasks.length}
              </h2>
              <div className="space-y-3">
                {tasksLoading ? (
                  <>
                    <TaskSkeleton />
                    <TaskSkeleton />
                    <TaskSkeleton />
                  </>
                ) : (
                  activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={(taskId) => {
                        const taskToDelete = tasks?.find(
                          (t) => t.id === taskId
                        );
                        if (taskToDelete) {
                          setTaskToDelete(taskToDelete);
                        }
                      }}
                      onEdit={(task) => setTaskToEdit(task)}
                    />
                  ))
                )}
              </div>
            </div>

            {(tasksLoading || completedTasks.length > 0) && (
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-4">
                  Completed - {tasksLoading ? "..." : completedTasks.length}
                </h2>
                <div className="space-y-3">
                  {tasksLoading ? (
                    <>
                      <TaskSkeleton />
                      <TaskSkeleton />
                    </>
                  ) : (
                    completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={(taskId) => {
                          const taskToDelete = tasks?.find(
                            (t) => t.id === taskId
                          );
                          if (taskToDelete) {
                            setTaskToDelete(taskToDelete);
                          }
                        }}
                        onEdit={(task) => setTaskToEdit(task)}
                      />
                    ))
                  )}
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
