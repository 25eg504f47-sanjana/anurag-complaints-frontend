import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { errorMessage } from '../api.js';
import ComplaintForm from '../components/ComplaintForm.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { STATUSES, formatDate, label } from '../utils.js';

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/api/complaints');
      setComplaints(data);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    complaints.forEach((x) => (c[x.status] += 1));
    return c;
  }, [complaints]);

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this complaint? This cannot be undone.')) return;
    try {
      await api.delete(`/api/complaints/${id}`);
      setComplaints((list) => list.filter((c) => c.id !== id));
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My complaints</h1>
          <p className="muted">Track what you have raised and read replies from the administration.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close form' : 'New complaint'}
        </button>
      </div>

      {showForm && (
        <ComplaintForm
          onCreated={(c) => {
            setComplaints((list) => [c, ...list]);
            setShowForm(false);
          }}
        />
      )}

      <div className="stat-row">
        <div className="stat">
          <strong>{complaints.length}</strong>
          <span>Total</span>
        </div>
        {STATUSES.map((s) => (
          <div className="stat" key={s}>
            <strong>{counts[s]}</strong>
            <span>{label(s)}</span>
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && complaints.length === 0 && !error && (
        <div className="card empty">You have not filed any complaints yet.</div>
      )}

      <div className="list">
        {complaints.map((c) => (
          <article className="card complaint" key={c.id}>
            <div className="complaint-head">
              <h3>{c.title}</h3>
              <StatusBadge status={c.status} />
            </div>
            <div className="meta">
              <span>{label(c.category)}</span>
              <span>Priority: {label(c.priority)}</span>
              <span>Filed {formatDate(c.createdAt)}</span>
              {c.updatedAt !== c.createdAt && <span>Updated {formatDate(c.updatedAt)}</span>}
            </div>
            <p className="desc">{c.description}</p>
            {c.adminResponse && (
              <div className="response">
                <strong>Administration reply</strong>
                <p>{c.adminResponse}</p>
              </div>
            )}
            {c.status === 'OPEN' && (
              <button className="btn btn-link danger" onClick={() => withdraw(c.id)}>
                Withdraw
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
