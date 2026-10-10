import { useState } from 'react';
import api, { errorMessage } from '../api.js';
import { CATEGORIES, PRIORITIES, label } from '../utils.js';

const empty = { title: '', description: '', category: 'ACADEMIC', priority: 'MEDIUM' };

export default function ComplaintForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/api/complaints', form);
      setForm(empty);
      onCreated(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>File a new complaint</h2>
      {error && <div className="alert alert-error">{error}</div>}

      <label>
        Title
        <input value={form.title} onChange={set('title')} maxLength={150} required placeholder="Short summary of the issue" />
      </label>

      <div className="row">
        <label>
          Category
          <select value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {label(c)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {label(p)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={set('description')}
          maxLength={2000}
          rows={5}
          required
          placeholder="What happened, where, and since when?"
        />
        <small className="muted">{form.description.length}/2000</small>
      </label>

      <button className="btn btn-primary" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit complaint'}
      </button>
    </form>
  );
}
