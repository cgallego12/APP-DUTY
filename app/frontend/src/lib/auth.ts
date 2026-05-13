import { useEffect, useState, useCallback } from 'react';
import { client } from './api';



export type UserRole = 'admin' | 'viewer' | null;

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

export interface AuthState {
  user: AuthUser | null;
  role: UserRole;
  loading: boolean;
  error: string | null;
}

/**
 * Ensures a user_roles record exists for the current user.
 * If not, creates one with 'viewer' role by default.
 * The first user to sign up is automatically promoted to admin.
 */
async function ensureUserRole(userId: string, email?: string): Promise<UserRole> {
  try {
    // Try to find existing role for this user
    const existing = await client.entities.user_roles.query({
      query: { user_id: userId },
      limit: 1,
    });

    const items = existing?.data?.items || [];
    if (items.length > 0) {
      return items[0].role as UserRole;
    }

    // No role yet — check if any roles exist at all
    const anyRoles = await client.entities.user_roles.query({
      query: {},
      limit: 1,
    });

    const totalItems = anyRoles?.data?.items || [];
    const isFirstUser = totalItems.length === 0;
    const newRole: UserRole = isFirstUser ? 'admin' : 'viewer';

    await client.entities.user_roles.create({
      data: {
        user_id: userId,
        role: newRole,
        email: email || '',
      },
    });

    return newRole;
  } catch (err) {
    console.error('Error ensuring user role:', err);
    return 'viewer';
  }
}

export function useAuth(): AuthState & {
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const resp = await client.auth.me();
      const userData = resp?.data;
      if (userData && userData.id) {
        const role = await ensureUserRole(userData.id, userData.email);
        setState({
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
          },
          role,
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, role: null, loading: false, error: null });
      }
    } catch (err) {
      setState({ user: null, role: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => {
    client.auth.toLogin();
  };

  const logout = async () => {
    try {
      await client.auth.logout();
    } catch (e) {
      console.error(e);
    }
    setState({ user: null, role: null, loading: false, error: null });
  };

  return { ...state, login, logout, refresh: checkAuth };
}

export { client };

export function getCurrentUser() {
  throw new Error('Function not implemented.');
}
