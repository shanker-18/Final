// Centralized helpers for determining a user's role (developer vs seeker)
// The "user" argument is typically the Firestore user document (userData),
// but it can be any object with userType, currentRole, or roles fields.

export function getUserRole(user) {
  // When no user profile is available yet, return null so the UI can wait
  if (!user) return null;

  const type = (user.userType || '').toLowerCase();
  const current = (user.currentRole || '').toLowerCase();
  const rolesArray = Array.isArray(user.roles) ? user.roles.map((r) => (r || '').toLowerCase()) : [];

  // Developer checks
  if (type === 'developer') return 'developer';
  if (current === 'developer') return 'developer';
  if (rolesArray.includes('developer')) return 'developer';

  // Seeker / project seeker checks (treat legacy "projectSeeker" as seeker)
  if (type === 'seeker' || type === 'projectseeker') return 'seeker';
  if (current === 'seeker' || current === 'projectseeker') return 'seeker';
  if (rolesArray.includes('seeker') || rolesArray.includes('projectseeker')) return 'seeker';

  // Default to seeker when we have a user but no explicit developer flags
  return 'seeker';
}

export function isDeveloper(user) {
  return getUserRole(user) === 'developer';
}

export function getUserRoleLabel(user) {
  const role = getUserRole(user);
  if (!role) return null;
  return role === 'developer' ? 'DEVELOPER' : 'PROJECT SEEKER';
}
