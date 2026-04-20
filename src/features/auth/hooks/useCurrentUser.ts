import { useMe } from './useAuth';
import type { UsuarioResponseDto } from '@/dto';


export function useCurrentUser(): {
  user: UsuarioResponseDto | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
} {
  const { data: user, isLoading, isFetching } = useMe();

  return {
    user,
    isAuthenticated: user !== undefined,
    isAdmin: user?.rol === 'ROL_ADMIN',
    
    
    isLoading: isLoading || (isFetching && user === undefined),
  };
}

