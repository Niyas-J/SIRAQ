import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { auth } from '../../lib/firebaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05070d] via-[#0a0c18] to-[#05070d] text-white">
      <div className="glass rounded-[30px] border border-white/10 bg-white/5 p-8 w-full max-w-md shadow-[0_25px_60px_rgba(4,6,16,0.55)]">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-2">Admin Login</h1>
          <p className="text-[#9CA5C2]">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
              placeholder="admin@siraq.studio"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#F9B234]/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#F9B234] to-[#15F4EE] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#06070C] shadow-[0_20px_45px_rgba(21,244,238,0.35)] transition hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#9CA5C2]">
          <p>Need access? Contact the system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;