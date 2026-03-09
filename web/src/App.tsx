import { useState, useCallback } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const TYPES = [
  { id: 'private', emoji: '🏠', label: 'Private' }, { id: 'business', emoji: '💼', label: 'Business' },
  { id: 'party', emoji: '🎉', label: 'Party' }, { id: 'wedding', emoji: '💍', label: 'Wedding' },
  { id: 'conference', emoji: '🎤', label: 'Conference' }, { id: 'birthday', emoji: '🎂', label: 'Birthday' },
  { id: 'corporate', emoji: '🏢', label: 'Corporate' }, { id: 'fundraiser', emoji: '💝', label: 'Fundraiser' },
];

function PlannerPage() {
  const [type, setType] = useState('party'); const [title, setTitle] = useState(''); const [guests, setGuests] = useState(50);
  const [budget, setBudget] = useState(''); const [date, setDate] = useState(''); const [location, setLocation] = useState(''); const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false); const [plan, setPlan] = useState<any>(null);
  const generate = useAction(api.ai.generatePlan); const save = useMutation(api.functions.saveEvent);

  const handleGenerate = useCallback(async () => {
    if (!title.trim()) return; setLoading(true);
    try {
      const p = await generate({ eventType: type, title: title.trim(), guestCount: guests, budget: budget || undefined, date: date || undefined, location: location || undefined, description: desc || undefined });
      setPlan(p);
      await save({ eventType: type, title, guestCount: guests, budget: budget || undefined, date: date || undefined, location: location || undefined, description: desc || undefined, plan: p });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [type, title, guests, budget, date, location, desc, generate, save]);

  return (
    <div className="mc"><div className="pg">
      <h1 className="title">Plan Your <span className="a">Event</span></h1>
      <p className="sub">Select an event type and let AI create a comprehensive plan with timeline, checklist, and budget.</p>
      <div className="type-grid">{TYPES.map(t => (<button key={t.id} className={`type-btn ${type === t.id ? 'sel' : ''}`} onClick={() => setType(t.id)}>{t.emoji} {t.label}</button>))}</div>
      <div className="row"><input className="inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event name" /><input className="inp" type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} min={1} style={{ maxWidth: '120px' }} placeholder="Guests" /></div>
      <div className="row"><input className="inp" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budget (optional, e.g. $5000)" /><input className="inp" type="date" value={date} onChange={e => setDate(e.target.value)} /><input className="inp" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (optional)" /></div>
      <textarea className="ta" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Additional details (optional)..." rows={2} />
      <button className="btn" disabled={!title.trim() || loading} onClick={handleGenerate}>{loading ? '⏳ Planning...' : '🎯 Generate Plan'}</button>
      {loading && <div className="ld"><span /><span /><span /></div>}
      {plan && !loading && <>
        {plan.timeline?.length > 0 && <div className="section"><div className="section-title">📅 Timeline</div>{plan.timeline.map((t: any, i: number) => (<div key={i} className="tl-item"><span className="tl-time">{t.time}</span><div><div className="tl-act">{t.activity}</div><div className="tl-note">{t.notes}</div></div></div>))}</div>}
        {plan.checklist?.length > 0 && <div className="section"><div className="section-title">✅ Checklist</div>{plan.checklist.map((c: any, i: number) => (<div key={i} className="cl-item"><span className={`cl-pri ${c.priority}`}>{c.priority}</span><span>{c.task}</span></div>))}</div>}
        {plan.budgetBreakdown?.length > 0 && <div className="section"><div className="section-title">💰 Budget Breakdown</div>{plan.budgetBreakdown.map((b: any, i: number) => (<div key={i} className="budget-row"><span>{b.item}</span><span className="budget-est">{b.estimate}</span></div>))}</div>}
        <div className="section"><div className="section-title">💡 Ideas</div>
          {plan.venueIdeas?.length > 0 && <><strong style={{ fontSize: '0.75rem', color: 'var(--txt2)' }}>Venue:</strong><div>{plan.venueIdeas.map((v: string, i: number) => <span key={i} className="idea-chip">{v}</span>)}</div></>}
          {plan.entertainmentIdeas?.length > 0 && <><strong style={{ fontSize: '0.75rem', color: 'var(--txt2)', display: 'block', marginTop: '0.5rem' }}>Entertainment:</strong><div>{plan.entertainmentIdeas.map((e: string, i: number) => <span key={i} className="idea-chip">{e}</span>)}</div></>}
        </div>
        {plan.tips?.length > 0 && <div className="tips"><strong>💡 Tips:</strong><br />{plan.tips.map((t: string, i: number) => <div key={i}>• {t}</div>)}</div>}
      </>}
    </div></div>
  );
}

function App() {
  return (<BrowserRouter><div className="app">
    <header className="hdr"><a href="/"><span style={{ fontSize: '1.5rem' }}>🎯</span><div><h1>EventPlanner</h1></div></a></header>
    <Routes><Route path="/" element={<PlannerPage />} /></Routes>
    <footer className="ftr">© {new Date().getFullYear()} EventPlanner — An AVS Media App.</footer>
  </div></BrowserRouter>);
}
export default App;
