import React from 'react';
import { TrendingUp, Eye, MessageSquare, Briefcase } from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon }) => (
  <div className="glass-card flex-col gap-4">
    <div className="flex justify-between items-center">
      <div className="text-secondary font-medium">{title}</div>
      <div style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
        <Icon size={20} color="var(--accent-blue)" />
      </div>
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 600 }}>{value}</div>
    <div className="flex items-center gap-2">
      <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{trend}</span>
      <span className="text-muted text-xs">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
        <p className="text-secondary">Track your listings and buyer interactions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Active Listings" value="3" trend="+1" icon={Briefcase} />
        <StatCard title="Total Views" value="12,450" trend="+14.5%" icon={Eye} />
        <StatCard title="Messages Sent" value="142" trend="+32%" icon={MessageSquare} />
        <StatCard title="Active Offers" value="5" trend="+2" icon={TrendingUp} />
      </div>

      <div className="flex gap-6" style={{ marginTop: '1rem' }}>
        <div className="glass-panel" style={{ flex: 2, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Buyer Activity</h2>
          
          <div className="flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-4">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <div className="font-medium">Strategic SaaS Buyer</div>
                    <div className="text-xs text-secondary">Viewed AI Photo Editor listing</div>
                  </div>
                </div>
                <div className="text-xs text-muted">2 hours ago</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Recommendations</h2>
          <div className="flex-col gap-4">
            <div className="p-4" style={{ background: 'rgba(169, 0, 255, 0.1)', border: '1px solid rgba(169, 0, 255, 0.3)', borderRadius: '8px' }}>
              <div className="font-semibold text-sm mb-2 text-white">Price Adjustment Suggested</div>
              <p className="text-xs text-secondary">Based on recent market data, lowering your asking price by 5% could increase buyer interest by 30%.</p>
            </div>
            <div className="p-4" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: '8px' }}>
              <div className="font-semibold text-sm mb-2 text-white">New Buyer Segment Found</div>
              <p className="text-xs text-secondary">We found 12 new PE firms interested in AI SaaS. Shall I draft introductions?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Temp import for the missing icon above
import { Users } from 'lucide-react';

export default Dashboard;
