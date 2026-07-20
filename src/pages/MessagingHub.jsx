import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Settings2 } from 'lucide-react';

const MessagingHub = ({ globalData }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [activeBuyerIdx, setActiveBuyerIdx] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  // Default buyers if accessed directly
  const defaultBuyers = [
    { name: "Nexus India Capital", type: "Private Equity Firm", budget: "₹2Cr - ₹5Cr", focus: ['AI SaaS'] }
  ];
  const buyers = globalData?.buyers || defaultBuyers;
  const activeBuyer = buyers[activeBuyerIdx];

  const defaultTechStack = globalData?.techStack || ['React', 'Node.js'];
  
  const [chatHistories, setChatHistories] = useState({});
  const [rules, setRules] = useState({
    targetPrice: globalData?.valuation?.replace(/[^0-9]/g, '') || "25000000",
    minPrice: "20000000",
    terms: ["All Cash", "Installments Allowed"]
  });

  // Initialize chat history with AI drafted opener for each buyer
  useEffect(() => {
    const initialHistories = {};
    buyers.forEach((b, idx) => {
      initialHistories[idx] = [
        { sender: 'You', text: `Hi ${b.name}, I saw you have a mandate for ${b.focus[0]}. We are looking for an acquisition. Are you open to a brief chat?` }
      ];
    });
    setChatHistories(initialHistories);
  }, []); // Run once on mount

  const currentHistory = chatHistories[activeBuyerIdx] || [];

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    // Add user message to history immediately
    const newHistory = [...currentHistory, { sender: 'You', text: textToSend }];
    setChatHistories(prev => ({ ...prev, [activeBuyerIdx]: newHistory }));
    setInput('');
    setAiSuggestion('');
    setIsTyping(true);

    try {
      // 1. Send the email via backend
      const res = await fetch('/api/chat/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerProfile: activeBuyer,
          subject: `Acquisition Opportunity: ${defaultTechStack.join(', ')} Startup`,
          message: textToSend
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const historyWithReply = [...newHistory, { sender: 'System', text: `Email successfully dispatched to ${activeBuyer.email || 'the firm'}! Their reply will go straight to your Gmail inbox.` }];
        setChatHistories(prev => ({ ...prev, [activeBuyerIdx]: historyWithReply }));
        
        // Optionally suggest a follow-up via Negotiator? Not needed for email.
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setIsTyping(false);
    }
  };

  const generateNegotiatorSuggestion = async (historyToAnalyze) => {
    setIsDrafting(true);
    try {
      const res = await fetch('/api/chat/negotiator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: historyToAnalyze,
          rules: rules
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiSuggestion(data.suggestion);
      } else {
        alert("Negotiator failed: " + data.error);
      }
    } catch (e) {
      console.error("Failed to generate suggestion", e);
      alert("Failed to connect to backend for AI Negotiator.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleRuleChange = (key, val) => {
    setRules(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex gap-6 h-full" style={{ height: 'calc(100vh - 140px)' }}>
      
      {/* Inbox List */}
      <div className="glass-panel flex-col" style={{ width: '320px', overflow: 'hidden' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-semibold mb-2">Inbox</h2>
          <input type="text" className="input-field text-sm" placeholder="Search conversations..." style={{ padding: '0.5rem' }} />
        </div>
        
        <div className="flex-col overflow-y-auto h-full">
          {buyers.map((buyer, idx) => {
            const isActive = idx === activeBuyerIdx;
            return (
              <div 
                key={idx} 
                onClick={() => setActiveBuyerIdx(idx)}
                className={`p-4 flex gap-3 cursor-pointer ${isActive ? 'bg-white/5 border-l-2 border-l-[var(--accent-blue)]' : 'hover:bg-white/5'}`}
                style={{ 
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>
                <div style={{ minWidth: 0 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm truncate">{buyer.name}</span>
                    <span className="text-xs text-secondary">Now</span>
                  </div>
                  <p className="text-xs text-secondary truncate">{buyer.type}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="glass-panel flex-col flex-1" style={{ overflow: 'hidden' }}>
        {/* Chat Header */}
        <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 className="font-semibold">{activeBuyer.name}</h2>
            <div className="text-xs text-secondary flex items-center gap-2">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></span>
              {activeBuyer.email || 'Public Email Target'}
            </div>
          </div>
          <button className="btn btn-secondary text-sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 size={16} /> Pitch Settings
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 flex-col gap-6 overflow-y-auto">
          {currentHistory.map((msg, i) => {
            const isMe = msg.sender === 'You';
            return (
              <div key={i} className={`flex gap-4 ${isMe ? '' : 'justify-end'}`}>
                {isMe && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={16} color="white" />
                  </div>
                )}
                <div className={`flex-col gap-1 w-full max-w-[80%] ${isMe ? '' : 'items-end'}`}>
                  <span className="text-xs text-secondary">{msg.sender}</span>
                  <div className={`p-4 rounded-xl ${isMe ? 'rounded-tl-none' : 'rounded-tr-none'}`} 
                       style={{ 
                         background: isMe ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                         border: isMe ? '1px solid rgba(0, 240, 255, 0.2)' : '1px solid var(--border-subtle)' 
                       }}>
                    {msg.text}
                  </div>
                </div>
                {!isMe && (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}></div>
                )}
              </div>
            );
          })}

          {isTyping && (
             <div className="text-sm text-secondary text-right">Sending Email...</div>
          )}
          {isDrafting && (
             <div className="text-sm text-secondary text-left">AI Negotiator is drafting a response...</div>
          )}

          {/* AI Suggested Reply */}
          {aiSuggestion && !isTyping && !isDrafting && (
            <div className="flex gap-4 mt-4">
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="white" />
              </div>
              <div className="flex-col gap-2 w-full max-w-[80%]">
                <span className="text-xs font-medium" style={{ color: 'var(--accent-purple)' }}>AI Suggested Response (Based on your limits)</span>
                <div className="p-4 rounded-xl rounded-tl-none relative" style={{ background: 'rgba(169, 0, 255, 0.1)', border: '1px solid rgba(169, 0, 255, 0.3)' }}>
                  {aiSuggestion}
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <button className="btn btn-primary text-xs py-1 px-3" onClick={() => handleSend(aiSuggestion)}>Send this</button>
                    <button className="btn btn-secondary text-xs py-1 px-3" onClick={() => generateNegotiatorSuggestion(currentHistory)}>Generate alternative</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex gap-2 items-center p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)' }}>
            <input 
              type="text" 
              className="w-full bg-transparent border-none text-white outline-none px-2 text-sm" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="p-2 rounded-md hover:bg-white/10 text-[var(--accent-blue)] transition-colors" onClick={() => generateNegotiatorSuggestion(currentHistory)}>
              <Bot size={20} />
            </button>
            <button className="p-2 rounded-md bg-[var(--accent-blue)] text-white hover:opacity-90 transition-opacity" onClick={() => handleSend()}>
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
              <label className="input-label text-xs">Target Price (₹)</label>
              <input type="text" className="input-field text-sm" value={rules.targetPrice} onChange={(e) => handleRuleChange('targetPrice', e.target.value)} />
            </div>
            <div>
              <label className="input-label text-xs">Minimum Acceptable Price (₹)</label>
              <input type="text" className="input-field text-sm" value={rules.minPrice} onChange={(e) => handleRuleChange('minPrice', e.target.value)} />
            </div>
            
            <div className="mt-2">
              <label className="input-label text-xs mb-2">Acceptable Terms</label>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={rules.terms.includes("All Cash")} onChange={(e) => {
                  if (e.target.checked) setRules({...rules, terms: [...rules.terms, "All Cash"]});
                  else setRules({...rules, terms: rules.terms.filter(t => t !== "All Cash")});
                }} /> <span className="text-sm">All Cash</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={rules.terms.includes("Installments")} onChange={(e) => {
                   if (e.target.checked) setRules({...rules, terms: [...rules.terms, "Installments"]});
                   else setRules({...rules, terms: rules.terms.filter(t => t !== "Installments")});
                }} /> <span className="text-sm">Installments Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={rules.terms.includes("Equity Retained")} onChange={(e) => {
                   if (e.target.checked) setRules({...rules, terms: [...rules.terms, "Equity Retained"]});
                   else setRules({...rules, terms: rules.terms.filter(t => t !== "Equity Retained")});
                }} /> <span className="text-sm">Equity Retained</span>
              </div>
            </div>

            <button className="btn btn-primary mt-4 w-full" onClick={() => setShowSettings(false)}>Save Rules</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MessagingHub;
