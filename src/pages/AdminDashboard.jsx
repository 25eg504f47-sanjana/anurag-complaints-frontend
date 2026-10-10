import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { errorMessage } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { STATUSES, formatDate, label } from '../utils.js';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const [list, st] = await Promise.all([
        api.get('/api/complaints', { params: filter ? { status: filter } : {} }),
        api.get('/api/complaints/stats'),
      ]);
      setComplaints(list.data);
      setStats(st.data);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return complaints;
    return complaints.filter((c) =>
      [c.title, c.description, c.studentName, c.studentEmail, c.rollNumber, c.department]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [complaints, search]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Complaint administration</h1>
          <p className="muted">Review, respond to and resolve student complaints.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <strong>{stats?.total ?? '–'}</strong>
          <span>Total</span>
        </div>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`stat stat-button ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(filter === s ? '' : s)}
          >
            <strong>{stats?.byStatus?.[s] ?? '–'}</strong>
            <span>{label(s)}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by title, student, roll number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="muted">Loading…</p>}

      {!loading && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Complaint</th>
                <th>Student</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Filed</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No complaints found.
                  </td>
                </tr>
              )}
              {visible.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="clickable">
                  <td>{c.id}</td>
                  <td className="title-cell">{c.title}</td>
                  <td>
                    {c.studentName}
                    <small className="muted block">
                      {[c.rollNumber, c.department].filter(Boolean).join(' · ')}
                    </small>
                  </td>
                  <td>{label(c.category)}</td>
                  <td>
                    <span className={`prio prio-${c.priority.toLowerCase()}`}>{label(c.priority)}</span>
                  </td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <ReviewModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </>
  );
}

function ReviewModal({ complaint, onClose, onSaved }) {
  const [status, setStatus] = useState(complaint.status);
  const [response, setResponse] = useState(complaint.adminResponse || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await api.patch(`/api/complaints/${complaint.id}/status`, { status, adminResponse: response });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    setBusy(true);
    try {
      await api.delete(`/api/complaints/${complaint.id}`);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="complaint-head">
          <h2>
            #{complaint.id} {complaint.title}
          </h2>
          <button className="btn btn-link" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="meta">
          <span>{label(complaint.category)}</span>
          <span>Priority: {label(complaint.priority)}</span>
          <span>Filed {formatDate(complaint.createdAt)}</span>
        </div>
        <p className="desc">{complaint.description}</p>
        <p className="muted">
          From <strong>{complaint.studentName}</strong> ({complaint.studentEmail})
          {complaint.rollNumber && <> · {complaint.rollNumber}</>}
          {complaint.department && <> · {complaint.department}</>}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reply to student
            <textarea rows={4} maxLength={2000} value={response} onChange={(e) => setResponse(e.target.value)} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn btn-link danger" onClick={remove} disabled={busy}>
            Delete
          </button>
          <div>
            <button className="btn btn-ghost-dark" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save} disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
