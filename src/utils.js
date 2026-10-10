export const CATEGORIES = ['ACADEMIC', 'HOSTEL', 'TRANSPORT', 'CANTEEN', 'INFRASTRUCTURE', 'LIBRARY', 'FEES', 'OTHER'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export function label(value) {
  if (!value) return '';
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function homePathFor(user) {
  return user?.role === 'ADMIN' ? '/admin' : '/dashboard';
}
