# System Patterns

*This document describes the system architecture, key technical decisions, design patterns, and critical implementation paths.*

- **Architecture:**
  - **Client-Server Architecture:** The application is divided into a frontend client and a backend server.
  - **Frontend:** A React single-page application (SPA) built with Vite. It handles the user interface and user interactions.
  - **Backend:** An Express.js server that acts as a proxy or gateway to the Google Generative AI services. It handles the logic for communicating with the AI models.

- **Technical Decisions:**
  - **TypeScript:** Using TypeScript for both frontend and backend (inferred) provides type safety and improves code quality.
  - **Vite:** Chosen as the frontend build tool for its speed and modern features.
  - **React Router:** Used for client-side routing to create a seamless navigation experience between pages.

- **Design Patterns:**
  - **Component-Based Architecture:** The frontend is built using React components, promoting reusability and separation of concerns.
  - **Service Layer:** The `services` directory suggests a pattern where API communication is abstracted into dedicated service modules (`geminiService.ts`, `lyriaService.ts`).
  - **Page-Based Routing:** The `pages` directory indicates that the application is structured around different pages or views.

- **Component Relationships:**
  - `App.tsx` is the root component that likely sets up the routing.
  - `pages/` components are the top-level views for different features (Home, ImageToMusic, TextToMusic, Gallery).
  - `components/` contains reusable UI elements used across different pages.
  - `services/` are used by the page components to fetch data from the backend.
