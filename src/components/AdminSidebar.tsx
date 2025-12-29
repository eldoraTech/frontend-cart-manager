import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, LogOut, ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/firebase';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/add-product', icon: Plus, label: 'Add Product' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 mb-8" onClick={() => setOpen(false)}>
        <ShoppingBag className="h-6 w-6 text-primary" />
        <span className="font-display text-xl font-semibold">StyleStore</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
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
    </div>
  );

  return (
    <>
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold">StyleStore</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border min-h-screen p-6 flex-col flex-shrink-0">
        <NavContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
