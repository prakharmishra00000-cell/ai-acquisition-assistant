import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LineChart, 
  Users, 
  MessageSquare, 
  Settings,
  ShieldAlert
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import NewListing from './pages/NewListing';
import WebsiteIntelligence from './pages/WebsiteIntelligence';
import BuyerMatches from './pages/BuyerMatches';
import MessagingHub from './pages/MessagingHub';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'New Listing', path: '/new-listing', icon: PlusCircle },
    { name: 'Intelligence', path: '/intelligence', icon: LineChart },
    { name: 'Buyer Matches', path: '/matches', icon: Users },
    { name: 'Messaging', path: '/messages', icon: MessageSquare },
  ];

  return (
    <aside className="glass-panel" style={{ width: '260px', height: 'calc(100vh - 32px)', margin: '16px', display: 'flex', flexDirection: 'column' }}>
      <div className="p-6">
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>AcquireAI</h1>
        <nav className="flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-4 p-4"
                style={{
                  borderRadius: '12px',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-blue)' : 'currentColor'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-4">
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }} />
          <div>
            <div className="font-semibold text-sm">Demo User</div>
            <div className="text-xs text-secondary">Seller Account</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const TopNav = () => {
  return (
    <header className="flex justify-between items-center p-6" style={{ width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Welcome back, Demo</h2>
        <p className="text-secondary text-sm">Here's what's happening with your listings today.</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => alert('Settings Panel (Account, Billing, AI Config) coming in Phase 3!')}>
          <Settings size={16} /> Settings
        </button>
      </div>
    </header>
  );
};

function App() {
  const [globalData, setGlobalData] = useState(null);

  return (
    <Router>
      <div className="flex" style={{ minHeight: '100vh' }}>
        <Sidebar />
        <main className="flex-col" style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          <TopNav />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard globalData={globalData} />} />
              <Route path="/new-listing" element={<NewListing setGlobalData={setGlobalData} />} />
              <Route path="/intelligence" element={<WebsiteIntelligence globalData={globalData} />} />
              <Route path="/matches" element={<BuyerMatches globalData={globalData} />} />
              <Route path="/messages" element={<MessagingHub globalData={globalData} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
