// TasksPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { TaskCard } from "../../components/TaskCard";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdArrowBackIos } from "react-icons/md";
import { Sidebar } from "../../components/layouts/Sidebar";

export const TasksPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { tasksQuery, collectionQuery, createTask, updateTask, deleteTask } =
    useTasks(Number(collectionId));

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  
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

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    await createTask({
      title: newTaskTitle,
      date: new Date().toISOString(),
      completed: false,
      collectionId: Number(collectionId),
    });
    setNewTaskTitle("");
    setShowAddTask(false);
    tasksQuery.refetch(); // Refresh the tasks list
  };

  const activeTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];

  if (tasksLoading || collectionLoading)
    return <div className="text-white">Loading...</div>;
  if (tasksError || collectionError)
    return <div className="text-red-500">Error loading tasks</div>;

  return (
    <div className="flex h-screen bg-[#1a1b1e]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/")}
              className="text-white hover:text-pink-500 transition-colors"
            >
              <MdArrowBackIos size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-white">{collection?.name}</h1>
          </div>

          {!showAddTask ? (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full p-4 mb-6 text-left text-gray-400 hover:text-white flex items-center gap-2 transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <FaPlus className="text-pink-500" />
              Add a task
            </button>
          ) : (
            <div className="mb-6">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                placeholder="Task name"
                className="w-full p-4 bg-[#2c2d31] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
                autoFocus
              />
            </div>
          )}

          <div className="space-y-8">
            <div>
              <h2 className="text-gray-400 text-sm font-medium mb-4">Tasks - {activeTasks.length}</h2>
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>

            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-gray-400 text-sm font-medium mb-4">
                  Completed - {completedTasks.length}
                </h2>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
