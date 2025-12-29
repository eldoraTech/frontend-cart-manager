import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAuthenticated } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (login(email, password)) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Try admin@gmail.com / admin123',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage your products
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo credentials:</strong><br />
                Email: admin@gmail.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
