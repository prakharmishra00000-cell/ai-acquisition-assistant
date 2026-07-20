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

const Dashboard = ({ globalData }) => {
  const activeListingsCount = globalData ? 1 : 0;
  const matchesCount = globalData?.buyers?.length || 0;
  const messagesSent = globalData ? 1 : 0;
  
  return (
    <div className="flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Overview</h1>
        <p className="text-secondary">Track your listings and buyer interactions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Active Listings" value={activeListingsCount} trend={activeListingsCount > 0 ? "+1" : "0"} icon={Briefcase} />
        <StatCard title="Total Views" value={globalData ? "1" : "0"} trend={globalData ? "+100%" : "0%"} icon={Eye} />
        <StatCard title="Messages Sent" value={messagesSent} trend="0%" icon={MessageSquare} />
        <StatCard title="Active Offers" value="0" trend="0" icon={TrendingUp} />
      </div>

      <div className="flex gap-6" style={{ marginTop: '1rem' }}>
        <div className="glass-panel" style={{ flex: 2, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Buyer Activity</h2>
          
          <div className="flex-col gap-4">
            {globalData ? globalData.buyers.map((buyer, idx) => (
              <div key={idx} className="flex items-center justify-between p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-4">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <div className="font-medium">{buyer.name}</div>
                    <div className="text-xs text-secondary">Matched with your listing</div>
                  </div>
                </div>
                <div className="text-xs text-muted">Just now</div>
              </div>
            )) : (
              <div className="text-secondary text-sm p-4">No recent activity. Create a new listing to see buyer matches.</div>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ flex: 1, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>AI Recommendations</h2>
          <div className="flex-col gap-4">
            {globalData ? (
              <>
                <div className="p-4" style={{ background: 'rgba(169, 0, 255, 0.1)', border: '1px solid rgba(169, 0, 255, 0.3)', borderRadius: '8px' }}>
                  <div className="font-semibold text-sm mb-2 text-white">Price Adjustment Suggested</div>
                  <p className="text-xs text-secondary">Based on recent market data, lowering your asking price of {globalData.valuation} by 5% could increase buyer interest by 30%.</p>
                </div>
                <div className="p-4" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: '8px' }}>
                  <div className="font-semibold text-sm mb-2 text-white">New Buyer Segment Found</div>
                  <p className="text-xs text-secondary">We found {matchesCount} Indian buyers interested in your tech stack. Head to the messaging hub to talk to them.</p>
                </div>
              </>
            ) : (
              <div className="text-secondary text-sm p-4">Analyze a website to receive AI recommendations.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Temp import for the missing icon above
import { Users } from 'lucide-react';

export default Dashboard;
