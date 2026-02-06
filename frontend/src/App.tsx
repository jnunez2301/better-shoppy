import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';

const App = () => {
  const { fetchMe, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return <RouterProvider router={router} />;
};

export default App;
