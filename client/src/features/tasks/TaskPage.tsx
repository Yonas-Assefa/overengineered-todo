// src/features/tasks/TasksPage.tsx
import { useParams } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { TaskCard } from "../../components/TaskCard";
import { useState } from "react";
import { Sidebar } from "../../components/layouts/Sidebar";
import { Navbar } from "../../components/layouts/Navbar";

export const TasksPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { tasksQuery, createTask, updateTask, deleteTask } = useTasks(
    Number(collectionId)
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { data: tasks, isLoading, error } = tasksQuery;

  const handleCreateTask = () => {
    if (!newTaskTitle) return;
    createTask({
      title: newTaskTitle,
      date: new Date().toISOString(),
      completed: false,
      collectionId: Number(collectionId),
    });
    setNewTaskTitle("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto bg-gray-900">
        <Navbar />
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-white mb-6">Tasks</h1>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a task"
              className="p-2 bg-gray-700 text-white rounded flex-1"
            />
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Add Task
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
