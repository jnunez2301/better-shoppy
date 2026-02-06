# Better Shoppy Frontend

This is the frontend application for Better Shoppy, built with **React**, **Vite**, and **Tailwind CSS**.

## Tech Stack

- **Framework**: React (with Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: Tanstack Query (React Query)
- **Routing**: Tanstack Router
- **Forms**: React Hook Form + Zod
- **Internationalization**: i18next

## Project Structure

```
src/
├── components/     # Shared UI components (Buttons, Inputs, Dialogs)
├── hooks/          # Custom hooks
├── pages/          # Application routes/pages
│   ├── CartList/   # Cart listing and creation
│   ├── CartDetail/ # Single cart view (products, realtime)
│   ├── Login/      # Authentication
│   └── Register/   # User registration
├── stores/         # Global state (AuthStore)
├── utils/          # Helpers (API client, Icon mappings)
└── main.tsx        # Entry point
```

## Key Features

- **Real-time Updates**: Uses Socket.IO (via backend) to reflect cart changes instantly.
- **Dark Mode**: Built-in dark/light mode toggle.
- **Localization**: Supports English and Spanish.
- **Responsive Design**: Mobile-first UI with Tailwind.

## Running Locally

1.  **Install Dependencies**:
    ```bash
    bun install
    ```
2.  **Start Dev Server**:
    ```bash
    bun dev
    ```
3.  **Build for Production**:
    ```bash
    bun run build
    ```
