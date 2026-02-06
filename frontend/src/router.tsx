import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  Navigate,
  useParams,
  useNavigate,
} from '@tanstack/react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import CartList from './pages/CartList/CartList';
import CartDetail from './pages/CartDetail/CartDetail';
import InvitationAccept from './pages/InvitationAccept';
import { useAuthStore } from './stores/useAuthStore';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

// Root route with Outlet for nested routes
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* Optional: Add TanStack DevTools in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});

// Private Route logic
// We can use the logic directly in the component or via beforeLoad
// Using a wrapper component pattern similar to previous implementation for simplicity in migration first
// But effectively TanStack Router prefers `beforeLoad`.

// Let's stick to the component wrapper for now to match the "Private Route" concept
// or better yet, use the `beforeLoad` hook on the route definition itself, which is the "TanStack way".
// However, since `useAuthStore` is a hook, it's tricky to use in `beforeLoad` if it's not a vanilla store or if we don't have access to context.
// `useAuthStore` from zustand is just a hook but the store itself can be imported.
// Let's stick to component-based protection for now as it's a direct translation of the existing logic.

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!token) return <Navigate to="/login" />;

  return <>{children}</>;
};

// Route Definitions
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PrivateRoute>
      <CartList />
    </PrivateRoute>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

const invitationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invitation/$token',
  component: InvitationAccept,
});

const cartDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart/$id',
  component: () => (
    <PrivateRoute>
      <CartDetail />
    </PrivateRoute>
  ),
});

// Configure the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  invitationRoute,
  cartDetailRoute,
]);

// Create the router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <Navigate to="/" />,
});

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
