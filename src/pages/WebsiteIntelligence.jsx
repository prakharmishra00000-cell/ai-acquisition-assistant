import React from 'react';
import { Cpu, Server, Shield, Smartphone, Zap, LineChart, FileText } from 'lucide-react';
import { useLocation, Navigate } from 'react-router-dom';

const IntelligenceCard = ({ title, items, icon: Icon }) => (
  <div className="glass-card flex-col gap-4">
    <div className="flex items-center gap-3 mb-2">
      <Icon size={20} color="var(--accent-purple)" />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span key={idx} className="badge badge-gray">{item}</span>
      ))}
    </div>
  </div>
);

const WebsiteIntelligence = () => {
  const location = useLocation();
  const data = location.state?.intelligenceData;

  // Fallback if accessed directly
  const displayData = data || {
    valuation: '$240,000',
    confidenceScore: 89,
    salesSummary: "An emerging AI SaaS platform with a modern Next.js/React frontend and a robust Node.js backend. It leverages OpenAI's models for core functionality. With strong mobile responsiveness and scalable architecture, it represents a highly attractive acquisition target for private equity looking to enter the AI design space.",
    techStack: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Tailwind CSS']
  };

  // Group tech stack randomly for visual representation
  const techGroups = {
    frontend: displayData.techStack.slice(0, Math.ceil(displayData.techStack.length / 3)) || ['React'],
    backend: displayData.techStack.slice(Math.ceil(displayData.techStack.length / 3), Math.ceil((displayData.techStack.length * 2) / 3)) || ['Node.js'],
    other: displayData.techStack.slice(Math.ceil((displayData.techStack.length * 2) / 3)) || ['Misc']
  };

  return (
    <div className="flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Website Intelligence</h1>
          <p className="text-secondary">Automated due diligence and valuation report.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('PDF Export coming in Phase 3!')}><FileText size={16} /> Export Pitch Deck</button>
      </div>

      {/* Valuation Section */}
      <div className="glass-panel p-8" style={{ background: 'linear-gradient(135deg, rgba(18,21,38,0.8), rgba(28,33,54,0.9))' }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-secondary font-medium mb-1">AI Exact Valuation</div>
            <div className="text-gradient" style={{ fontSize: '3rem', fontWeight: 700 }}>
              {displayData.valuation}
            </div>
          </div>
          <div className="text-right">
            <div className="text-secondary font-medium mb-1">Confidence Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-green)' }}>{displayData.confidenceScore}%</div>
          </div>
        </div>
        
        <div className="mt-6 p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
          <h4 className="font-semibold mb-2">AI Sales Summary</h4>
          <p className="text-sm text-secondary leading-relaxed">
            "{displayData.salesSummary}"
          </p>
        </div>
      </div>

      {/* Tech Stack Analysis */}
      <h2 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Detected Architecture</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <IntelligenceCard title="Frontend Frameworks" icon={Smartphone} items={techGroups.frontend} />
        <IntelligenceCard title="Backend & Infrastructure" icon={Server} items={techGroups.backend} />
        <IntelligenceCard title="Integrations & Other" icon={Cpu} items={techGroups.other} />
      </div>
    </div>
  );
};

export default WebsiteIntelligence;
