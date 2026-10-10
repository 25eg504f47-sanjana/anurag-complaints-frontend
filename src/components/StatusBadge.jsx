import { label } from '../utils.js';

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{label(status)}</span>;
}
