import { useEffect } from 'react';

import { usePage } from '@inertiajs/react';

import useAuthStore from '@/Stores/authStore';

/**
 * Hook to sync auth state with Inertia page props during navigation
 * This keeps the Zustand auth store synchronized with the server state
 */
export function useAuthSync() {
  const { auth } = usePage<{ auth: { user: any } }>().props;
  const { set } = useAuthStore();

  useEffect(() => {
    if (auth?.user) {
      set({
        user: auth.user,
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  }, [auth?.user, set]);

  return null;
}

export default useAuthSync;
