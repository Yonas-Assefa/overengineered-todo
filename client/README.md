# Overengineered Todo Frontend

A modern, feature-rich todo application with collections management, task organization, and a beautiful dark-themed UI. Built with React and TypeScript.

## 🚀 Features

- 📁 Collections management (create, edit, delete)
- ✅ Task management within collections
- ⭐ Favorites system
- 🎨 Modern dark theme UI
- 📱 Responsive design
- 📅 Date-based task organization

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** 
  - React Query for server state
  - Zustand for client state
- **Form Handling:** React Hook Form with Zod validation
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **UI Components:** Custom components with React Icons
- **Date Handling:** date-fns
- **Notifications:** react-hot-toast

## 📁 Project Structure

```
client/
├── src/
│   ├── api/              # API integration and services
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Reusable UI components
│   ├── config/          # Application configuration
│   ├── contexts/        # React context providers
│   ├── features/        # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party library configurations
│   ├── providers/       # Application providers
│   ├── routes/          # Route definitions and components
│   ├── schemas/         # Validation schemas
│   ├── stores/          # State management stores
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.css          # Root application styles
│   ├── index.css        # Global styles
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite environment types
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── .gitignore          # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tsconfig.node.json  # TypeScript Node configuration
└── vite.config.ts      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   VITE_API_URL=http://localhost:3000
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
