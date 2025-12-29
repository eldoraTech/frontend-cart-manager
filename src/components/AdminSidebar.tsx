import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/storage';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/add-product', icon: Plus, label: 'Add Product' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <ShoppingBag className="h-6 w-6 text-primary" />
        <span className="font-display text-xl font-semibold">StyleStore</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
};

export default AdminSidebar;
