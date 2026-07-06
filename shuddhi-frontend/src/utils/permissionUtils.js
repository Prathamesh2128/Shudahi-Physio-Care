export const permissionUtils = {
  /**
   * Check if user has a specific permission slug
   * @param {string[]} userPermissions - array from JWT
   * @param {string}   required        - e.g. 'pharmacy:dispense'
   */

  has(userPermissions, required) {
    if (!Array.isArray(userPermissions)) return false;
    return userPermissions.includes(required);
  },

  /**
   * Check if user has ANY of the given permissions
   */
  hasAny(userPermissions, required = []) {
    if (!Array.isArray(userPermissions)) return false;
    return required.some((p) => userPermissions.includes(p));
  },

  /**
   * Check if user has ALL of the given permissions
   */
  hasAll(userPermissions, required = []) {
    if (!Array.isArray(userPermissions)) return false;
    return required.every((p) => userPermissions.includes(p));
  },

  /**
   * Check if user has a specific role
   */
  hasRole(userRoles, role) {
    if (!Array.isArray(userRoles)) return false;
    return userRoles.includes(role);
  },

  hasAnyRole(userRoles, roles = []) {
    if (!Array.isArray(userRoles)) return false;
    return roles.some((r) => userRoles.includes(r));
  },
};
