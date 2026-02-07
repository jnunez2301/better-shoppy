import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useTheme } from 'next-themes';

const App = () => {
  const { fetchMe, token, user } = useAuthStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  // Sync theme
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    }
  }, [user?.theme, setTheme]);

  return <RouterProvider router={router} />;
};

export default App;
