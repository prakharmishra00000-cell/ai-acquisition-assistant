import React from 'react';
import { Target, History, Building, CheckCircle2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchCard = ({ name, type, matchScore, budget, techPrefs, focus }) => (
  <div className="glass-card flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Building size={24} color="var(--accent-purple)" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{name}</h3>
          <span className="text-secondary text-sm">{type}</span>
        </div>
      </div>
      <div className="flex-col items-end">
        <div className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{matchScore}% Match</div>
        <span className="badge badge-green" style={{ fontSize: '0.65rem', marginTop: '4px' }}>Highly Compatible</span>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
      <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <div className="text-xs text-secondary mb-1 flex items-center gap-1"><Target size={12}/> Budget</div>
        <div className="font-medium text-sm">{budget}</div>
      </div>
      <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <div className="text-xs text-secondary mb-1 flex items-center gap-1"><History size={12}/> History</div>
        <div className="font-medium text-sm">3 Acquisitions</div>
      </div>
      <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        <div className="text-xs text-secondary mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> Tech</div>
        <div className="font-medium text-sm">{techPrefs}</div>
      </div>
    </div>

    <div className="mt-2">
      <div className="text-xs text-secondary mb-1">Acquisition Focus</div>
      <div className="flex gap-2">
        {focus.map(f => <span key={f} className="badge badge-gray">{f}</span>)}
      </div>
    </div>

    <div className="flex justify-end gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <button className="btn btn-secondary text-sm" onClick={() => alert('Detailed Buyer Profiles coming in Phase 3!')}>View Profile</button>
      <button className="btn btn-primary text-sm" onClick={() => navigate('/messages')}><MessageSquare size={14}/> Draft Pitch</button>
    </div>
  </div>
);

const BuyerMatches = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-col gap-8">
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Buyer Matches</h1>
        <p className="text-secondary">We found 24 potential buyers based on your tech stack and valuation.</p>
      </div>

      <div className="flex-col gap-6">
        <MatchCard 
          name="Nexus Capital"
          type="Private Equity Firm"
          matchScore={96}
          budget="$200k - $500k"
          techPrefs="React, Node.js"
          focus={['AI SaaS', 'B2B Tools', 'High Margin']}
        />
        
        <MatchCard 
          name="Sarah Jenkins (MicroPE)"
          type="Individual Investor"
          matchScore={89}
          budget="$100k - $300k"
          techPrefs="Agnostic"
          focus={['Solo Founder', 'Low Maintenance', 'AI Tools']}
        />
        
        <MatchCard 
          name="TechAcquire Group"
          type="Strategic Buyer"
          matchScore={82}
          budget="$250k - $1M"
          techPrefs="Python, React"
          focus={['DevTools', 'API Products', 'SaaS']}
        />
      </div>
    </div>
  );
};

export default BuyerMatches;
