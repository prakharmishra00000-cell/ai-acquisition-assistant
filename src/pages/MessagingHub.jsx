import React, { useState } from 'react';
import { Send, Bot, User, Settings2 } from 'lucide-react';

const MessagingHub = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex gap-6 h-full" style={{ height: 'calc(100vh - 140px)' }}>
      
      {/* Inbox List */}
      <div className="glass-panel flex-col" style={{ width: '320px', overflow: 'hidden' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-semibold mb-2">Inbox</h2>
          <input type="text" className="input-field text-sm" placeholder="Search conversations..." style={{ padding: '0.5rem' }} />
        </div>
        
        <div className="flex-col overflow-y-auto h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-4 flex gap-3 cursor-pointer ${i === 1 ? 'bg-white/5 border-l-2 border-l-[var(--accent-blue)]' : 'hover:bg-white/5'}`}
                 style={{ 
                   background: i === 1 ? 'rgba(255,255,255,0.05)' : 'transparent',
                   borderLeft: i === 1 ? '2px solid var(--accent-blue)' : '2px solid transparent',
                   borderBottom: '1px solid var(--border-subtle)'
                 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>
              <div style={{ minWidth: 0 }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate">Nexus Capital</span>
                  <span className="text-xs text-secondary">2h</span>
                </div>
                <p className="text-xs text-secondary truncate">We are very interested in the tech stack...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-panel flex-col flex-1" style={{ overflow: 'hidden' }}>
        {/* Chat Header */}
        <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 className="font-semibold">Nexus Capital</h2>
            <div className="text-xs text-secondary flex items-center gap-2">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></span>
              Active on Acquire.com
            </div>
          </div>
          <button className="btn btn-secondary text-sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 size={16} /> AI Negotiator Rules
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 flex-col gap-6 overflow-y-auto">
          
          <div className="flex gap-4">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={16} color="white" />
            </div>
            <div className="flex-col gap-1 w-full max-w-[80%]">
              <span className="text-xs text-secondary">You (Drafted by AI)</span>
              <div className="p-4 rounded-xl rounded-tl-none" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                Hi Nexus Capital, I saw you have a mandate for AI SaaS. My project is generating $5k MRR with a fully automated Next.js/OpenAI stack. Are you open to a brief chat?
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <div className="flex-col gap-1 w-full max-w-[80%] items-end">
              <span className="text-xs text-secondary">Nexus Capital</span>
              <div className="p-4 rounded-xl rounded-tr-none" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)' }}>
                Thanks for reaching out! The stack looks solid. What is your absolute bottom line for an all-cash offer?
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>
          </div>

          {/* AI Suggested Reply */}
          <div className="flex gap-4 mt-4">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={16} color="white" />
            </div>
            <div className="flex-col gap-2 w-full max-w-[80%]">
              <span className="text-xs font-medium" style={{ color: 'var(--accent-purple)' }}>AI Suggested Response (Based on your limits)</span>
              <div className="p-4 rounded-xl rounded-tl-none relative" style={{ background: 'rgba(169, 0, 255, 0.1)', border: '1px solid rgba(169, 0, 255, 0.3)' }}>
                I'm aiming for $250k based on standard multiples, but for a fast, all-cash close with no earn-outs, I'd be willing to discuss $220k.
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                  <button className="btn btn-primary text-xs py-1 px-3">Send this</button>
                  <button className="btn btn-secondary text-xs py-1 px-3">Generate alternative</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Chat Input */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex gap-2 items-center p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
            <input type="text" className="w-full bg-transparent border-none text-white outline-none px-2 text-sm" placeholder="Type a message or let AI draft it..." />
            <button className="p-2 rounded-md hover:bg-white/10 text-[var(--accent-blue)] transition-colors">
              <Bot size={20} />
            </button>
            <button className="p-2 rounded-md bg-[var(--accent-blue)] text-white hover:opacity-90 transition-opacity">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Sidebar Panel */}
      {showSettings && (
        <div className="glass-panel flex-col p-6 animate-float" style={{ width: '300px', animation: 'none' }}>
          <h3 className="font-semibold mb-4">AI Negotiator Rules</h3>
          
          <div className="flex-col gap-4">
            <div>
              <label className="input-label text-xs">Target Price ($)</label>
              <input type="text" className="input-field text-sm" defaultValue="250,000" />
            </div>
            <div>
              <label className="input-label text-xs">Minimum Acceptable Price ($)</label>
              <input type="text" className="input-field text-sm" defaultValue="200,000" />
            </div>
            
            <div className="mt-2">
              <label className="input-label text-xs mb-2">Acceptable Terms</label>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" defaultChecked /> <span className="text-sm">All Cash</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" defaultChecked /> <span className="text-sm">Installments Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" /> <span className="text-sm">Equity Retained</span>
              </div>
            </div>

            <button className="btn btn-primary mt-4 w-full">Save Rules</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MessagingHub;
