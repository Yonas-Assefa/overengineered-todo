import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CollectionsPage } from "../features/collections/CollectionsPage";
import { TasksPage } from "../features/tasks/TaskPage";
import { Navbar } from "../components/layouts/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <CollectionsPage />
      </MainLayout>
    ),
  },
  {
    path: "/collections/:collectionId",
    element: (
      <MainLayout>
        <TasksPage />
      </MainLayout>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
