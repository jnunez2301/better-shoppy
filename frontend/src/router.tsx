import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  Navigate,
} from '@tanstack/react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import CartList from './pages/CartList/CartList';
import CartDetail from './pages/CartDetail/CartDetail';
import ProductCatalog from './pages/ProductCatalog/ProductCatalog';
import InvitationAccept from './pages/InvitationAccept';
import { useAuthStore } from './stores/useAuthStore';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!token) return <Navigate to="/login" />;

  return <>{children}</>;
};

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

const productCatalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => (
    <PrivateRoute>
      <ProductCatalog />
    </PrivateRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  invitationRoute,
  cartDetailRoute,
  productCatalogRoute,
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <Navigate to="/" />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
