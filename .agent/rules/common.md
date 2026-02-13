---
trigger: always_on
---

# Common Instructions

This file contains common instructions and coding standards for the backend of the Shopping List application.

## Coding Standards
General:
- Use always Bun as package manager
- Use **ES6+** syntax.
- Prefer **async/await** over callbacks or raw promises.
- Use descriptive variable and function names.
- Keep functions small and focused on a single task.
Frontend:
- Components must look like this
- Use TailwindCSS
- Use typescript as the programming language
- Database passwords, API Keys, sensitive information must use environment variables

## Project Structure
* `.github/`: Github configuration
* * `workflows/`: Github workflows
* `backend/`: backend files
* `frontend/`: Frontend files
* `data/`: Data persisted from volumes, log files, config files.
* `docker-compose.yml`: Compose file used to build this app


## Compose

## Compose

* It must build a mysql database (MySQL 8.0)
* It must build backend that depends on database
* It must build frontend that depends on backend
* **Traefik** is used as the reverse proxy (v2.11).
    * Do not use Nginx.
    * Use Docker Labels on services (`traefik.http.routers...`) to configure routing.
    * Frontend: `/`
    * Backend: `/api` and `/socket.io`
* MySQL database config must follow good and secure practices
* Do not add version to the start of the file, it's deprecated


## Database Config
* Use a non-root MySQL user
* Disable empty passwords
* Store credentials in env vars
* Persist data using volumes

## Backend rules
* You must use MySQL database
* Passwords must be hashed using bcrypt
* Create CORS policy to allow frontend to interact with the backend

## Frontend Rules
* Do not import React explicitly. Rely on the automatic JSX runtime.
* Components must be functional components using arrow functions. Props and hooks are allowed.
* You must use Code based route configuration (@tanstack/react-router)
* Every component must look like this
```typescript
const ComponenteA = () => {
   return <div data-testid="component-a"></div>
}
```
* The app must have a dark mode and light mode
* The light mode and dark mode must have a toggable Button so we can change this setting
* You must use `Zod` for form validation
* On form error you must provide a message displaying what is wrong
* Once you finish everything make sure to run `npm install` and `npm run build`

## Frontend Structure
* `src/`: Main App files
* `stores/`: Common zustand stores
* `src/router.tsx`: File used to store routes
* `src/main.tsx`: Keep it simple and just do the basic main things like setting up providers
* `components/`: Common components used trough the app like Buttons, Icons, etc
* `pages/`: Routes from each route on the app
* * `components/`: Components used on this route and only usable here
* * `hooks/`: Hooks made to use on this route
* * `utils/`: Helper functions made to use on this route
* * `store/`: Store used on this page for specific usages
* * `PageName.tsx`: Page main function where it wraps all components used on this route
* Dockerfile: Frontend dockerfile to build the image

## Backend Structure

* * `controller/`: Request handlers.
* * `service/`: Core business logic.
* * `model/`: Database schemas and models.
* * `middleware/`: Express/server middleware.
* * `config/`: Configuration files (DB, env, etc.).
* * `environment.ts`: Environment file that gets all the env variables
* * `utils/`: Helper functions.
* Dockerfile: Backend dockerfile to build the image

## Backend Dependencies

* @sequelize/mysql
* @types/bun
* chalk
* cors
* dotenv
* express
* multer
* sequelize 
* bcrypt
* socket.io

## Frontend Dependencies
* axios
* react-hook-form
* @tanstack/react-router
* @tanstack/react-query
* tailwindcss
* @tailwindcss/vite
* react-icons
* zustand
* zod
* @hookform/resolvers
* @tanstack/react-query
* @hookform/resolvers
* @tanstack/react-query
* sonner
* next-themes

## Error Handling
- Use centralized error handling when possible.
- Always provide meaningful error messages in responses.
- Backend must use a centralized Express error-handling middleware.