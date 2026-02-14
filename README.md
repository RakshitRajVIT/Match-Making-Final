# MatchMaker Magic

A modern matchmaking quiz application built with React, TypeScript, and Supabase.

## Project Overview

MatchMaker Magic is an interactive quiz platform designed to match users based on compatibility. The application features a sleek UI with smooth animations and real-time data synchronization.

## Getting Started

### Prerequisites

You'll need:
- Node.js & npm (or Bun)
- Git

### Installation

\\\sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd matchmaker-magic

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
\\\

The application will be available at \http://localhost:8080\

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **shadcn-ui** - High-quality UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a service (database & auth)
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Vitest** - Unit testing framework

## Project Structure

\\\
src/
+-- components/       # Reusable UI components
+-- pages/           # Page components (Index, Admin, Reveal)
+-- hooks/           # Custom React hooks
+-- lib/             # Utility functions
+-- data/            # Static data and quiz data
+-- integrations/    # External service integrations (Supabase)
+-- test/            # Test files
\\\

## Available Scripts

- \
pm run dev\ - Start development server
- \
pm run build\ - Build for production
- \
pm run preview\ - Preview production build locally
- \
pm run lint\ - Run ESLint
- \
pm test\ - Run tests
- \
pm run test:watch\ - Run tests in watch mode

## Development

Edit files in the \src/\ directory. The development server will automatically reload with your changes.

## Build for Production

\\\sh
npm run build
\\\

The optimized build output will be in the \dist/\ directory.

## Deployment

You can deploy the \dist/\ folder to your preferred hosting platform (Vercel, Netlify, GitHub Pages, etc.).

## License

MIT
