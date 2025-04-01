## 📌 Project: Overengineered To-Do App

Your task is to build a **CRUD To-Do Web Application** using the following stack:

- **Backend**: Node.js with Express
- **Frontend**: React (No Next.js or Tanstack Start)
- **Database**: MySQL **or** PostgreSQL (You can use an ORM eg. Prisma)
- **Language**: **TypeScript** (for both frontend and backend)

You’ll be working with a simple task management system based on a database schema we’ve defined for you below.

---

## 🗃️ Database Structure

You’ll start with a database named `task-database` with two base tables:

### `collections`

| Column | Type    |
| ------ | ------- |
| `id`   | INT     |
| `name` | VARCHAR |

Seeded data:

| id  | name      |
| --- | --------- |
| 1   | school    |
| 2   | personal  |
| 3   | design    |
| 4   | groceries |

---

### `tasks`

| Column      | Type     |
| ----------- | -------- |
| `id`        | INT      |
| `title`     | VARCHAR  |
| `date`      | DATETIME |
| `completed` | BOOLEAN  |

Each task belongs to a collection via a foreign key (`collection_id`).

---

**Note:**  
You are encouraged to **tweak or expand the database schema** as needed to support the features you’re building. You can choose between **MySQL or PostgreSQL**, depending on your comfort and the features you want to implement.

---

## ✨ Features & Requirements

Build a full-featured to-do list application based on the structure above. It should include:

### 🔧 Core Functionality

- **Create Tasks**

  - A user can create a task and assign it to a collection.
  - This should insert a row in the `tasks` table linked via the `collection_id`.
  - Tasks can have subtasks nested underneath them.

- **Edit Tasks**

  - Double-clicking a task opens a dialog to:
    - Edit the task's title.
    - Toggle its completed state.
    - Add, edit, or remove subtasks.

- **Delete Tasks**

  - Long-pressing a task opens a delete confirmation dialog.
  - Deleting a parent task should also delete all associated subtasks.

- **Display Tasks**

  - Display tasks grouped or filtered by their collection.
  - Show subtasks nested under their parent tasks with proper indentation.
  - Completing a parent task should mark all subtasks as complete.

- The app should handle all states gracefully — loading, empty, error — to provide a smooth user experience.

---

### 🎨 UI Expectations

- Follow the **attached design** as a reference.
- UI **must be adaptive and responsive** across device sizes.
- **Do not** use **Material UI** or styled components
- Tailwind CSS is recommended for its utility-first approach and maintainability, but feel free to use any styling method that keeps the codebase clean and modular.

---

### 🧠 Architecture Guidelines

This is called the **Overengineered To-Do App** for a reason:

- Use **TypeScript** across the entire stack.
- Structure your code with **clean architecture** and **maintainability** in mind.
- Use a **state/query management tool** (Redux Toolkit + RTK Query preferred, or React Query, etc.).
- Apply **best practices**: scalable folder structure, reusable components, clean API layers, separation of concerns.

- Code should be structured for testability and future scaling — including thoughtful abstractions in your API, logic, and domain models.

- Your codebase should be structured in a way that makes it easy to test — even if you don’t write the actual tests.

- Typed code should be expressive and safe — avoid relying on `any`, and model your data structures clearly and intentionally.

- Assume this project may grow or be deployed across multiple environments — config separation, environment variables, and modular setup are all welcome signs.

We expect solid fundamentals and good engineering judgment — Things like user-friendly UX interactions, data syncing, or separation of concerns should feel natural to implement.

---

### 🌟 Bonus (Nice-to-Have)

- Support for **theming** (e.g., light/dark mode).
- Ability to mark a collection as a **favorite**.
- Anything cool/fun is up to you!

---

## 📬 Submission Instructions

Please submit the following:

- A **GitHub repo** with your complete project.
- **README.md** with:
  - Setup instructions.
  - Any architectural notes or decisions you made.
  - Technologies used and Feature descriptions (for the unique ones at least)
  - Screenshots/Recording or preview links (optional).

---

We’re looking forward to seeing your take on a simple idea done really well. Overengineer away — and have fun with it!
