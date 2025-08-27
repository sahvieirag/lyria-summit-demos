# Technical Context

*This document details the technologies used, development setup, technical constraints, and dependencies.*

- **Technologies:**
  - **Frontend:** React, Vite, TypeScript
  - **Backend:** Node.js, Express
  - **API:** Google Generative AI, Google Auth Library
  - **Styling:** (Not specified, likely CSS or a framework like Tailwind CSS)
  - **Routing:** React Router

- **Development Environment:**
  - The project uses `concurrently` to run the frontend and backend servers simultaneously with `npm run dev`.
  - The frontend is served by Vite on a development server.
  - The backend is a Node.js server running with `node backend/server.js`.

- **Technical Constraints:**
  - The project is split into a frontend and a backend, requiring both to be running for full functionality.

- **Dependencies:**
  - **Frontend:** `react`, `react-dom`, `react-router-dom`, `qrcode.react`
  - **Backend:** `@google/genai`, `cors`, `express`, `google-auth-library`, `node-fetch`
  - **Dev Dependencies:** `@types/node`, `concurrently`, `typescript`, `vite`
