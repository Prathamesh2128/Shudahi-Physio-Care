import useAuthStore from '../store/authStore';
import { permissionUtils } from '../utils/permissionUtils';

export function usePermissions() {
  const user = useAuthStore(state => state.user);

  const permissions = user?.permissions || [];
  const roles       = user?.roles       || [];

  return {
    permissions,
    roles,
    can:      (slug)     => permissionUtils.has(permissions, slug),
    canAny:   (slugs)    => permissionUtils.hasAny(permissions, slugs),
    canAll:   (slugs)    => permissionUtils.hasAll(permissions, slugs),
    isRole:   (role)     => permissionUtils.hasRole(roles, role),
    isAnyRole:(roleList) => permissionUtils.hasAnyRole(roles, roleList),
  };
}