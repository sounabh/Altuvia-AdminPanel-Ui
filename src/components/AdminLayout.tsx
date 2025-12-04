// app/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  FileTextIcon,
  LogOut,
  Loader2,
} from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';


// ---------- Navigation config ----------
const navigationItems = [
  { id: 'dashboard', title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { id: 'universities', title: 'Universities', url: '/universities', icon: Building2 },
  { id: 'programs', title: 'Programs', url: '/programs', icon: GraduationCap },
  { id: 'students', title: 'Students', url: '/students', icon: Users },
  { id: 'essays', title: 'Essays', url: '/essays', icon: FileTextIcon },
];

const API_URL = process.env.BACKEND_URI;

// ---------- Helpers ----------
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const getInitials = (email: string) => {
  if (!email) return 'AD';
  return email.substring(0, 2).toUpperCase();
};

// ---------- Sidebar component ----------
function AdminSidebar({
  currentPath,
  onLogout,
  adminEmail,
}: {
  currentPath: string;
  onLogout: () => void;
  adminEmail: string;
}) {
  const router = useRouter();

  return (
    <aside className="w-64 border-r bg-white flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">AltuVia</h1>
      </div>

      <div className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">{adminEmail}</p>
          </div>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{getInitials(adminEmail)}</span>
          </div>
        </div>
      </div>

      <nav className="px-2 py-4 flex-1 overflow-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.url || (item.url !== '/' && currentPath.startsWith(item.url));
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.url)}
              className={`flex items-center w-full px-4 py-3 my-1 text-sm font-medium rounded-md text-left transition ${
                active ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ---------- Login component ----------
function LoginPage({ onSuccess }: { onSuccess: (token: string, email: string) => void }) {
  const [email, setEmail] = useState('admin@altuvia.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        const token = data.data.token;
        const adminEmail = data.data.email || email;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminEmail', adminEmail);
        onSuccess(token, adminEmail);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@altuvia.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={doLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Layout root (wraps all pages) ----------
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const email = localStorage.getItem('adminEmail') || '';
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
        setAdminEmail(email);
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        setIsAuthenticated(false);
        setAdminEmail('');
      }
      setLoading(false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setAdminEmail('');
    router.push('/');
  };

  const handleLoginSuccess = (token: string, email: string) => {
    setIsAuthenticated(true);
    setAdminEmail(email);
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        </body>
      </html>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body>
          <LoginPage onSuccess={handleLoginSuccess} />
        </body>
      </html>
    );
  }

  // Authenticated - show admin layout
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          {/* KEY FIX: Added w-full to ensure full viewport width */}
          <div className="flex min-h-screen w-full bg-gray-50">
            <AdminSidebar 
              currentPath={pathname || '/'} 
              onLogout={handleLogout} 
              adminEmail={adminEmail} 
            />

            {/* KEY FIX: Added min-w-0 to prevent flex item from overflowing 
                and w-full to ensure it takes remaining space */}
            <div className="flex-1 flex flex-col min-w-0 w-full">
              {/* KEY FIX: Main content area now has proper width constraints */}
              <main className="flex-1 p-6 w-full min-h-screen">
                {/* KEY FIX: Wrapper div ensures children always have full width */}
                <div className="w-full h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}