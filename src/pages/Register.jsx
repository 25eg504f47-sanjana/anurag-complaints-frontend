import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { errorMessage } from '../api.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNumber: '', department: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card form auth-card" onSubmit={submit}>
        <h1>Student registration</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <label>
          Full name
          <input value={form.name} onChange={set('name')} maxLength={100} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <div className="row">
          <label>
            Roll number
            <input value={form.rollNumber} onChange={set('rollNumber')} maxLength={30} />
          </label>
          <label>
            Department
            <input value={form.department} onChange={set('department')} maxLength={100} placeholder="e.g. CSE" />
          </label>
        </div>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            minLength={8}
            required
            autoComplete="new-password"
          />
          <small className="muted">At least 8 characters</small>
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
        <p className="muted center">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
