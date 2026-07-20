import React, { useState } from 'react';
import { Wand2, Globe, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewListing = () => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [intelligenceData, setIntelligenceData] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url) return;
    setStep(2);
    
    try {
      // In development, you might need the full URL depending on your proxy setup.
      // Assuming relative paths work if served by the same express server, or we use localhost
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url, targetPrice: price })
      });
      
      const data = await response.json();
      if (data.success) {
        setIntelligenceData(data.data);
        setStep(3);
      } else {
        alert('Failed to analyze website. ' + data.error);
        setStep(1);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('Error connecting to backend API.');
      setStep(1);
    }
  };

  const handleFinish = () => {
    navigate('/intelligence', { state: { intelligenceData } });
  };

  return (
    <div className="flex-col items-center justify-center h-full w-full" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '4rem' }}>
      
      {/* Progress Tracker */}
      <div className="flex items-center gap-4 w-full justify-center mb-12">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[var(--accent-blue)] text-white' : 'bg-[var(--bg-surface-light)] text-[var(--text-muted)]'}`} style={{ background: step >= 1 ? 'var(--accent-blue)' : 'var(--bg-surface-light)', color: step >= 1 ? '#000' : 'var(--text-muted)', fontWeight: 'bold' }}>1</div>
        <div style={{ height: '2px', width: '50px', background: step >= 2 ? 'var(--accent-blue)' : 'var(--bg-surface-light)' }} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[var(--accent-blue)] text-white' : 'bg-[var(--bg-surface-light)] text-[var(--text-muted)]'}`} style={{ background: step >= 2 ? 'var(--accent-blue)' : 'var(--bg-surface-light)', color: step >= 2 ? '#000' : 'var(--text-muted)', fontWeight: 'bold' }}>2</div>
        <div style={{ height: '2px', width: '50px', background: step >= 3 ? 'var(--accent-blue)' : 'var(--bg-surface-light)' }} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-[var(--accent-blue)] text-white' : 'bg-[var(--bg-surface-light)] text-[var(--text-muted)]'}`} style={{ background: step >= 3 ? 'var(--accent-blue)' : 'var(--bg-surface-light)', color: step >= 3 ? '#000' : 'var(--text-muted)', fontWeight: 'bold' }}>3</div>
      </div>

      <div className="glass-panel p-8 w-full animate-float" style={{ animationDuration: '6s', border: '1px solid var(--border-glow)' }}>
        
        {step === 1 && (
          <div className="flex-col gap-6 text-center">
            <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Sell Your Project</h1>
            <p className="text-secondary mb-4">Enter your details and let our AI agents handle the rest.</p>
            
            <div className="flex-col gap-4 text-left">
              <div>
                <label className="input-label"><Globe size={14} style={{ display: 'inline', marginRight: '6px' }}/> Website URL</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="https://yourstartup.com" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label"><DollarSign size={14} style={{ display: 'inline', marginRight: '6px' }}/> Target Asking Price ($)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. 250,000" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={handleAnalyze}>
              <Wand2 size={18} /> Analyze with AI
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col items-center justify-center py-12 gap-6 text-center">
            <div className="animate-pulse-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--accent-blue)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '1.5rem' }}>AI is analyzing your website...</h2>
            <div className="text-secondary text-sm flex-col gap-2">
              <p>Scanning frontend architecture via BuiltWith...</p>
              <p>Generating Exact Valuation with Gemini...</p>
            </div>
            <div className="skeleton w-full" style={{ height: '4px', marginTop: '1rem' }}></div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col items-center justify-center gap-6 text-center">
            <div style={{ width: '64px', height: '64px', background: 'rgba(57, 255, 20, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} color="var(--accent-green)" />
            </div>
            <h2 style={{ fontSize: '2rem' }} className="text-gradient">Analysis Complete</h2>
            <p className="text-secondary">We've generated your exact valuation and sales pitch.</p>
            
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleFinish}>
              View Intelligence Report <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewListing;
