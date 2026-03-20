import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo-koliesko.png';
import { Loader2, Lock } from 'lucide-react';

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

  const inputClass = "w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      {/* Decorative */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gold/3 blur-[100px]" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="Koliesko" className="h-16 mx-auto mb-5 drop-shadow-lg" />
          <h1 className="font-display text-2xl font-bold text-foreground">Administrácia</h1>
          <p className="text-muted-foreground text-sm mt-1.5">Prihláste sa do admin panelu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-7 space-y-4 shadow-premium-lg">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <Lock size={14} />
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="admin@klubkoliesko.sk" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Heslo</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-premium glow-gold-hover active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}
