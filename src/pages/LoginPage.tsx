import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo-koliesko.png';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError('Nesprávny e-mail alebo heslo.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="Koliesko" className="h-16 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground">Administrácia</h1>
          <p className="text-muted-foreground text-sm mt-1">Prihláste sa do admin panelu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Heslo</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97] disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}
