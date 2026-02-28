import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8095/api/events';
const AUTH = { username: 'admin', password: 'admin123' };

/* ── Animated counter hook ── */
function useCounter(target, duration = 1400, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);
  return val;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080b12;
    --surface: #0e1420;
    --surface2: #141b28;
    --border: rgba(255,255,255,0.06);
    --accent: #00f5a0;
    --accent2: #00d4ff;
    --danger: #ff4d6d;
    --text: #e8edf5;
    --muted: #6b7894;
    --glow: 0 0 30px rgba(0,245,160,0.15);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(0,245,160,0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(0,212,255,0.05) 0%, transparent 50%);
    animation: bgPulse 8s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }

  @keyframes bgPulse {
    0%   { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.1) rotate(5deg); }
  }

  /* ════ SPLASH ════ */
  .splash {
    position: fixed; inset: 0;
    background: var(--bg);
    z-index: 9999;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 28px;
    transition: opacity 0.7s ease, visibility 0.7s ease;
  }

  .splash.hide { opacity: 0; visibility: hidden; pointer-events: none; }

  .splash-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,245,160,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,160,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 3s linear infinite;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  }

  @keyframes gridMove {
    0%   { background-position: 0 0; }
    100% { background-position: 60px 60px; }
  }

  .splash-logo {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    animation: splashIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }

  @keyframes splashIn {
    from { opacity: 0; transform: translateY(40px) scale(0.85); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .splash-icon {
    width: 88px; height: 88px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 26px;
    display: flex; align-items: center; justify-content: center;
    font-size: 42px;
    box-shadow: 0 0 60px rgba(0,245,160,0.5), 0 0 120px rgba(0,245,160,0.2);
    animation: iconPop 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both, iconGlow 2s ease-in-out 1.5s infinite;
  }

  @keyframes iconPop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  @keyframes iconGlow {
    0%,100% { box-shadow: 0 0 60px rgba(0,245,160,0.5), 0 0 120px rgba(0,245,160,0.2); }
    50%      { box-shadow: 0 0 90px rgba(0,245,160,0.7), 0 0 180px rgba(0,245,160,0.35); }
  }

  .splash-title {
    font-family: 'Syne', sans-serif;
    font-size: 52px; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -2px;
    animation: splashIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both;
  }

  .splash-sub {
    font-size: 13px; color: var(--muted);
    letter-spacing: 5px; text-transform: uppercase;
    animation: splashIn 0.7s ease 0.8s both;
  }

  .splash-progress {
    width: 300px;
    animation: splashIn 0.6s ease 1s both;
  }

  .splash-track {
    background: var(--surface2);
    border-radius: 100px; height: 3px; overflow: hidden;
  }

  .splash-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 100px;
    animation: fillProgress 2.2s cubic-bezier(0.4,0,0.2,1) 1.2s forwards;
    width: 0;
    box-shadow: 0 0 10px var(--accent);
  }

  @keyframes fillProgress {
    0%   { width: 0%; }
    50%  { width: 70%; }
    85%  { width: 92%; }
    100% { width: 100%; }
  }

  .splash-msg {
    font-size: 12px; color: var(--muted);
    letter-spacing: 1.5px;
    animation: splashIn 0.5s ease 1.2s both, msgChange 2s steps(1) 1.2s forwards;
  }

  @keyframes msgChange {
    0%   { content: 'Connecting to database...'; }
    40%  { content: 'Loading events...'; }
    80%  { content: 'Ready!'; }
  }

  .splash-dots {
    display: flex; gap: 8px;
    animation: splashIn 0.5s ease 1.4s both;
  }

  .splash-dot {
    width: 7px; height: 7px;
    background: var(--accent); border-radius: 50%;
    animation: dotBounce 1.2s ease-in-out infinite;
    box-shadow: 0 0 6px var(--accent);
  }
  .splash-dot:nth-child(2) { animation-delay: 0.2s; background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }
  .splash-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotBounce {
    0%,80%,100% { transform: translateY(0) scale(1); opacity: 0.5; }
    40%          { transform: translateY(-8px) scale(1.3); opacity: 1; }
  }

  /* ════ APP ════ */
  .app {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 0 24px 60px;
    animation: appReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }

  @keyframes appReveal {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .header {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 28px 0 40px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 40px;
    animation: fadeInDown 0.7s ease 0.3s both;
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .logo { display: flex; align-items: center; gap: 12px; }

  .logo-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: var(--glow);
    animation: logoBounce 4s ease-in-out 1s infinite;
  }

  @keyframes logoBounce {
    0%,100% { transform: rotate(0deg); }
    25%      { transform: rotate(-8deg) scale(1.08); }
    75%      { transform: rotate(8deg) scale(1.08); }
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }

  .live-badge {
    display: flex; align-items: center; gap: 8px;
    background: rgba(0,245,160,0.08);
    border: 1px solid rgba(0,245,160,0.2);
    padding: 8px 16px; border-radius: 100px;
    font-size: 13px; color: var(--accent); font-weight: 500;
    animation: badgePop 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both;
  }

  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }

  .live-dot {
    width: 8px; height: 8px;
    background: var(--accent); border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 8px var(--accent);
  }

  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.4; transform: scale(0.7); }
  }

  /* STATS */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 32px;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden;
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    animation: statIn 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes statIn {
    from { opacity: 0; transform: translateY(32px) scale(0.93); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .stat-card:hover {
    transform: translateY(-7px);
    border-color: rgba(0,245,160,0.25);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4), var(--glow);
  }

  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.45s ease;
  }
  .stat-card:hover::before { transform: scaleX(1); }

  .stat-card::after {
    content: '';
    position: absolute; top: -100%; left: -100%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
    transition: left 0.6s ease, top 0.6s ease;
  }
  .stat-card:hover::after { top: -100%; left: 150%; }

  .stat-icon { font-size: 28px; margin-bottom: 12px; display: block; }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800;
    background: linear-gradient(135deg, var(--text), rgba(232,237,245,0.7));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1; margin-bottom: 4px;
  }

  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .stat-change { position: absolute; top: 20px; right: 20px; font-size: 12px; color: var(--accent); font-weight: 500; }

  /* NOTIFICATIONS */
  .notifications { margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }

  .notification {
    background: rgba(0,245,160,0.06);
    border: 1px solid rgba(0,245,160,0.15);
    border-radius: 10px; padding: 12px 16px;
    font-size: 13px; color: var(--accent);
    display: flex; align-items: center; gap: 10px;
    animation: slideIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .main-layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 24px; align-items: start;
  }

  .form-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    position: sticky; top: 24px;
    animation: formIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  }

  @keyframes formIn {
    from { opacity: 0; transform: translateX(-32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .form-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .form-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 500; }

  .form-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0,245,160,0.1);
    transform: translateY(-1px);
  }

  .form-input::placeholder { color: var(--muted); }
  textarea.form-input { resize: vertical; min-height: 80px; }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #080b12; border: none; border-radius: 10px; padding: 14px;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    margin-top: 8px; letter-spacing: 0.5px;
    position: relative; overflow: hidden;
  }

  .btn-primary::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .btn-primary:hover::after { transform: translateX(100%); }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,245,160,0.35); }
  .btn-primary:active { transform: scale(0.98); }

  .btn-secondary {
    width: 100%; background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 10px; padding: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    cursor: pointer; transition: all 0.2s; margin-top: 8px;
  }
  .btn-secondary:hover { border-color: var(--muted); color: var(--text); }

  .events-panel {
    animation: panelIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both;
  }

  @keyframes panelIn {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
  .panel-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; white-space: nowrap; }
  .search-wrapper { position: relative; flex: 1; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; pointer-events: none; }

  .search-bar {
    width: 100%;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px 10px 40px;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-bar:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,245,160,0.1); }
  .search-bar::placeholder { color: var(--muted); }

  .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; }

  .filter-tab {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--muted); padding: 6px 16px; border-radius: 100px;
    font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .filter-tab.active { background: rgba(0,245,160,0.1); border-color: rgba(0,245,160,0.3); color: var(--accent); }

  .events-list { display: flex; flex-direction: column; gap: 12px; }

  .event-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
    animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
    position: relative; overflow: hidden;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .event-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0,245,160,0.18);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  }

  .event-card::before {
    content: '';
    position: absolute; top: -1px; left: -100%; right: auto;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .event-card:hover::before { opacity: 1; animation: scanLine 1.2s linear infinite; }

  @keyframes scanLine {
    from { left: -100%; }
    to   { left: 100%; }
  }

  .event-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .event-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--text); flex: 1; margin-right: 16px; }
  .event-actions { display: flex; gap: 8px; flex-shrink: 0; }

  .btn-icon {
    width: 34px; height: 34px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface2);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 15px; transition: all 0.25s; color: var(--muted);
  }
  .btn-icon:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,245,160,0.08); transform: scale(1.15) rotate(-5deg); }
  .btn-icon.danger:hover { border-color: var(--danger); color: var(--danger); background: rgba(255,77,109,0.08); transform: scale(1.15) rotate(5deg); }

  .event-desc { font-size: 14px; color: var(--muted); margin-bottom: 14px; line-height: 1.6; }
  .event-meta { display: flex; gap: 16px; flex-wrap: wrap; }
  .event-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
  .event-meta-item span:first-child { font-size: 15px; }

  .participants-bar { margin-top: 14px; background: var(--surface2); border-radius: 100px; height: 4px; overflow: hidden; }
  .participants-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 100px; transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; color: var(--text); margin-bottom: 8px; }
  .empty-text { font-size: 14px; }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(8,11,18,0.85);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: var(--surface);
    border: 1px solid rgba(0,245,160,0.15);
    border-radius: 20px; padding: 32px;
    width: 480px; max-width: 90vw;
    animation: modalIn 0.4s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), var(--glow);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.88) translateY(32px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    margin-bottom: 24px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .modal-actions { display: flex; gap: 12px; margin-top: 24px; }

  .btn-update {
    flex: 1; background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #080b12; border: none; border-radius: 10px; padding: 13px;
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-update:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,245,160,0.3); }

  .btn-cancel {
    flex: 1; background: transparent; color: var(--muted);
    border: 1px solid var(--border); border-radius: 10px; padding: 13px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { border-color: var(--muted); color: var(--text); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 3px; }

  @media (max-width: 900px) {
    .main-layout { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-card { position: static; }
  }
`;

const emptyForm = { title: '', description: '', location: '', eventDate: '', maxParticipants: 10 };

function StatCard({ icon, target, label, change, delay, started }) {
  const val = useCounter(target, 1400, started);
  return (
      <div className="stat-card" style={{ animationDelay: delay }}>
        <span className="stat-icon">{icon}</span>
        <div className="stat-value">{val}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-change">{change}</div>
      </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone]     = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const [events, setEvents]             = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [form, setForm]                 = useState(emptyForm);
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('all');
  const [editEvent, setEditEvent]       = useState(null);
  const [editForm, setEditForm]         = useState(emptyForm);
  const [loading, setLoading]           = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashDone(true), 3200);
    const t2 = setTimeout(() => setStatsStarted(true), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    fetchEvents();
    connectWebSocket();
    return () => { if (stompClient.current) stompClient.current.deactivate(); };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL, { auth: AUTH });
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8095/ws'),
      onConnect: () => {
        client.subscribe('/topic/events', (msg) => {
          setNotifications(prev => [msg.body, ...prev].slice(0, 5));
        });
      }
    });
    client.activate();
    stompClient.current = client;
  };

  const createEvent = async () => {
    if (!form.title.trim()) { alert('Title daalo!'); return; }
    setLoading(true);
    try {
      await axios.post(API_URL, form, { auth: AUTH });
      await fetchEvents();
      setForm(emptyForm);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { auth: AUTH });
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) { console.error(err); }
  };

  const openEdit = (event) => {
    setEditEvent(event);
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      eventDate: event.eventDate || '',
      maxParticipants: event.maxParticipants || 10,
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${editEvent.id}`, editForm, { auth: AUTH });
      await fetchEvents();
      setEditEvent(null);
    } catch (err) { console.error(err); }
  };

  const filteredEvents = events.filter(e => {
    const q = search.toLowerCase();
    const match = e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
    if (filter === 'upcoming') return match && e.eventDate && new Date(e.eventDate) > new Date();
    if (filter === 'past')     return match && e.eventDate && new Date(e.eventDate) <= new Date();
    return match;
  });

  const totalParticipants = events.reduce((s, e) => s + (e.currentParticipants || 0), 0);
  const maxCapacity        = events.reduce((s, e) => s + (e.maxParticipants || 0), 0);
  const upcoming           = events.filter(e => e.eventDate && new Date(e.eventDate) > new Date()).length;

  return (
      <>
        <style>{styles}</style>

        {/* SPLASH */}
        <div className={`splash ${splashDone ? 'hide' : ''}`}>
          <div className="splash-grid" />
          <div className="splash-logo">
            <div className="splash-icon">🎯</div>
            <div className="splash-title">SR-Event.OS</div>
          </div>
          <div className="splash-sub">Management Platform</div>
          <div className="splash-progress">
            <div className="splash-track">
              <div className="splash-fill" />
            </div>
          </div>
          <div className="splash-msg">Connecting to database...</div>
          <div className="splash-dots">
            <div className="splash-dot" />
            <div className="splash-dot" />
            <div className="splash-dot" />
          </div>
        </div>

        {/* MAIN */}
        <div className="app">
          <header className="header">
            <div className="logo">
              <div className="logo-icon">🎯</div>
              <div>
                <div className="logo-text">SR-Event.OS</div>
                <div className="logo-sub">Management Platform</div>
              </div>
            </div>
            <div className="live-badge">
              <div className="live-dot" />
              Live · WebSocket Connected
            </div>
          </header>

          {notifications.length > 0 && (
              <div className="notifications">
                {notifications.map((n, i) => <div key={i} className="notification">🔔 {n}</div>)}
              </div>
          )}

          <div className="stats-grid">
            <StatCard icon="📅" target={events.length}    label="Total Events"   change="+Active"    delay="0.1s" started={statsStarted} />
            <StatCard icon="🚀" target={upcoming}          label="Upcoming"       change="Scheduled"  delay="0.2s" started={statsStarted} />
            <StatCard icon="👥" target={totalParticipants} label="Participants"   change="Registered" delay="0.3s" started={statsStarted} />
            <StatCard icon="🏟️" target={maxCapacity}       label="Total Capacity" change="Seats"      delay="0.4s" started={statsStarted} />
          </div>

          <div className="main-layout">
            <div className="form-card">
              <div className="form-title">Create New Event</div>
              <div className="form-subtitle">Fill in the details to schedule your event</div>
              {[
                { label: 'Event Title', key: 'title',    placeholder: 'e.g. Tech Conference 2026', type: 'text' },
                { label: 'Location',    key: 'location', placeholder: 'e.g. Mumbai, India',        type: 'text' },
              ].map(f => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" type={f.type} placeholder={f.placeholder}
                           value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
              ))}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="Describe your event..."
                          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date & Time</label>
                <input className="form-input" type="datetime-local"
                       value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Participants</label>
                <input className="form-input" type="number" min="1"
                       value={form.maxParticipants} onChange={e => setForm({ ...form, maxParticipants: parseInt(e.target.value) })} />
              </div>
              <button className="btn-primary" onClick={createEvent} disabled={loading}>
                {loading ? '⏳ Creating...' : '✦ Create Event'}
              </button>
              <button className="btn-secondary" onClick={() => setForm(emptyForm)}>Clear Form</button>
            </div>

            <div className="events-panel">
              <div className="panel-header">
                <div className="panel-title">All Events ({filteredEvents.length})</div>
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input className="search-bar" placeholder="Search events..."
                         value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>

              <div className="filter-tabs">
                {['all', 'upcoming', 'past'].map(f => (
                    <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                      {f === 'all' ? '✦ All' : f === 'upcoming' ? '🚀 Upcoming' : '📁 Past'}
                    </button>
                ))}
              </div>

              <div className="events-list">
                {filteredEvents.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎪</div>
                      <div className="empty-title">No events found</div>
                      <div className="empty-text">Create your first event using the form!</div>
                    </div>
                ) : (
                    filteredEvents.map((event, i) => {
                      const fill = event.maxParticipants > 0
                          ? Math.min(100, Math.round((event.currentParticipants / event.maxParticipants) * 100)) : 0;
                      return (
                          <div className="event-card" key={event.id} style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="event-card-header">
                              <div className="event-title">{event.title}</div>
                              <div className="event-actions">
                                <button className="btn-icon" onClick={() => openEdit(event)}>✏️</button>
                                <button className="btn-icon danger" onClick={() => deleteEvent(event.id)}>🗑️</button>
                              </div>
                            </div>
                            {event.description && <div className="event-desc">{event.description}</div>}
                            <div className="event-meta">
                              {event.location && <div className="event-meta-item"><span>📍</span><span>{event.location}</span></div>}
                              {event.eventDate && (
                                  <div className="event-meta-item">
                                    <span>🗓️</span>
                                    <span>{new Date(event.eventDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                  </div>
                              )}
                              <div className="event-meta-item">
                                <span>👥</span>
                                <span>{event.currentParticipants || 0} / {event.maxParticipants}</span>
                              </div>
                            </div>
                            {event.maxParticipants > 0 && (
                                <div className="participants-bar">
                                  <div className="participants-fill" style={{ width: `${fill}%` }} />
                                </div>
                            )}
                          </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {editEvent && (
              <div className="modal-overlay" onClick={() => setEditEvent(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-title">✏️ Edit Event</div>
                  {[
                    { label: 'Title',    key: 'title',    type: 'text' },
                    { label: 'Location', key: 'location', type: 'text' },
                  ].map(f => (
                      <div className="form-group" key={f.key}>
                        <label className="form-label">{f.label}</label>
                        <input className="form-input" type={f.type}
                               value={editForm[f.key]} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })} />
                      </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input"
                              value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <input className="form-input" type="datetime-local"
                           value={editForm.eventDate} onChange={e => setEditForm({ ...editForm, eventDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Participants</label>
                    <input className="form-input" type="number"
                           value={editForm.maxParticipants} onChange={e => setEditForm({ ...editForm, maxParticipants: parseInt(e.target.value) })} />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setEditEvent(null)}>Cancel</button>
                    <button className="btn-update" onClick={saveEdit}>Save Changes</button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
  );
}