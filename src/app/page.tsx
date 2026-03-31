"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bruno_Ace_SC, Space_Grotesk } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import NavBar, { HexLogo } from '../components/NavBar';
import { languages, getTranslation } from '../utils/i18n';

// Advanced futuristic fonts
const bruno = Bruno_Ace_SC({ subsets: ['latin'], weight: '400' });
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

function NeonCursor() {
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const dots = useRef(Array.from({ length: 8 }, () => ({ x: 0, y: 0 })));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    const animate = () => {
      dots.current.forEach((dot, index) => {
        // Dot 0 bounds perfectly to mouse. Remaining dots interpolate cleanly via spring physics.
        const nextDot = index === 0 ? mousePos.current : dots.current[index - 1];
        
        dot.x += (nextDot.x - dot.x) * (index === 0 ? 1 : 0.4);
        dot.y += (nextDot.y - dot.y) * (index === 0 ? 1 : 0.4);

        if (cursorRefs.current[index]) {
          cursorRefs.current[index]!.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`;
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {dots.current.map((_, i) => (
        <div 
          key={i}
          ref={(el) => { cursorRefs.current[i] = el; }}
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
             opacity: 1 - (i * 0.1),
          }}
        >
           <div 
              className={`bg-[#39ff14] rounded-full mix-blend-screen shadow-[0_0_15px_#39ff14]`}
              style={{ width: `${14 - (i * 1.5)}px`, height: `${14 - (i * 1.5)}px`, filter: `blur(${i === 0 ? 0 : 2}px)` }}
           ></div>
        </div>
      ))}
    </>
  );
}

function MeteorShower() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate distant randomized meteors
  const meteors = new Array(8).fill(true);
  return (
    <div className="fixed inset-0 z-[0] overflow-hidden pointer-events-none opacity-20">
      {meteors.map((_, i) => (
        <span
          key={i}
          className="meteor absolute h-[0.5px] w-[50px] lg:w-[80px] bg-gradient-to-r from-transparent via-[#39ff14] to-transparent opacity-0 mix-blend-screen shadow-[0_0_5px_#39ff14]"
          style={{
            top: Math.floor(Math.random() * 100) + -20 + '%',
            left: Math.floor(Math.random() * 100) + -20 + '%',
            animationDelay: `${Math.random() * (30 - 5) + 5}s`,
            animationDuration: `${Math.random() * (50 - 35) + 35}s`
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en');
  const [isSwiping, setIsSwiping] = useState(false);
  const [showExtInstructions, setShowExtInstructions] = useState(false);

  const handleStartAudit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSwiping(true);
    // Wait for the button to physically flip the switch ON before triggering Next.js route change
    setTimeout(() => {
      router.push(`/audit?lang=${selectedLang}`);
    }, 450);
  };

  // Simulate site boot-up logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds boot
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={`min-h-screen bg-[#050505] text-white overflow-x-hidden relative ${grotesk.className} selection:bg-[#39ff14]/40`}>
      
      <NeonCursor />
      <MeteorShower />

      {/* =========================================
          SITE BOOT LOADER (ANIMATED)
          ========================================= */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030303] transition-all duration-1000 ease-in-out ${
          isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
        }`}
      >
        <div className="relative flex flex-col items-center">
          {/* Pulsing intense outer ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#39ff14] rounded-full blur-[80px] opacity-40 animate-pulse"></div>
          
          {/* Animated Logo */}
          <div className="relative text-[#39ff14] w-24 h-24 mb-8">
             <div className="absolute inset-0 animate-ping opacity-30">
                <HexLogo />
             </div>
             <div className="relative drop-shadow-[0_0_20px_#39ff14] animate-[pulse_2s_ease-in-out_infinite]">
                <HexLogo />
             </div>
          </div>
          
          {/* Loading Text */}
          <div className={`${bruno.className} text-[#39ff14] text-xl tracking-[0.4em] mb-4 drop-shadow-[0_0_8px_#39ff14]`}>
            AWARESHIELD
          </div>
          
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(57,255,20,0.5)]">
            <div className="absolute top-0 left-0 h-full bg-[#39ff14] w-full origin-left animate-[scaleX_2.5s_ease-out_forwards] shadow-[0_0_10px_#39ff14]"></div>
          </div>
        </div>
      </div>


      {/* =========================================
          BACKGROUND NEON GLOWS (INTENSIFIED!)
          ========================================= */}
      <div className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-[#39ff14] rounded-full blur-[160px] opacity-[0.25] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[55vw] h-[55vw] bg-[#39ff14] rounded-full blur-[140px] opacity-[0.2] pointer-events-none mix-blend-screen"></div>
      {/* Center ambient glow */}
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-[#39ff14] rounded-full blur-[200px] opacity-[0.12] pointer-events-none mix-blend-screen"></div>

      {/* =========================================
          ORBITAL LINES & DOTS (GLOW MAXIMIZED)
          ========================================= */}
      {/* Right main orbit */}
      <div 
        className="absolute -top-[5%] -right-[5%] w-[45vw] h-[100vh] rounded-[50%] border-t-[2px] border-l-[1px] border-b-[1px] border-[#39ff14]/30 pointer-events-none shadow-[inset_10px_0_50px_rgba(57,255,20,0.1),0_0_30px_rgba(57,255,20,0.05)]"
        style={{ animation: 'spin 120s linear infinite' }}
      >
        <div className="absolute top-[20%] right-[11%] w-3 h-3 bg-[#39ff14] rounded-full shadow-[0_0_20px_#39ff14,0_0_40px_#39ff14]">
          {/* Connection line extending left from dot highly illuminated */}
          <div className="absolute top-1/2 right-[100%] w-16 h-[2px] bg-gradient-to-l from-[#39ff14] to-transparent -translate-y-1/2 shadow-[0_0_10px_#39ff14]"></div>
        </div>
      </div>
      
      {/* Left lower orbit - Positioned to bridge Hero and Feature sections */}
      <div 
        className="absolute top-[65vh] left-[-3%] w-[45vw] h-[80vh] rounded-[50%] border-t-[2px] border-r-[1px] border-b-[1px] border-[#39ff14]/30 pointer-events-none shadow-[inset_-10px_0_50px_rgba(57,255,20,0.1),0_0_30px_rgba(57,255,20,0.05)]"
        style={{ animation: 'spin 90s linear infinite reverse' }}
      >
        <div className="absolute bottom-[28%] left-[16%] w-2.5 h-2.5 bg-[#39ff14] rounded-full shadow-[0_0_20px_#39ff14,0_0_40px_#39ff14]"></div>
      </div>


      {/* NAVIGATION BAR */}
      <NavBar />

      {/* MAIN LAYOUT GRID */}
      <div className="relative z-20 flex h-[80vh] w-full max-w-[1440px] mx-auto pt-6">
        
        {/* LEFT COMPONENT - Play button & Adaptive text */}
        <div className="w-[15%] lg:w-[20%] flex flex-col justify-center items-start pl-8 lg:pl-16 relative">
          
          <div className="flex items-center relative mb-24 cursor-pointer group">
            {/* Play Button */}
            <button className="w-16 h-16 bg-[#0a0a0a] border border-[#39ff14]/50 group-hover:border-[#39ff14] group-hover:bg-[#39ff14]/15 transition-all duration-300 rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(57,255,20,0.3)] group-hover:shadow-[0_0_50px_rgba(57,255,20,0.6)]">
              <div className="w-11 h-11 bg-[#39ff14] group-hover:bg-[#52ff37] rounded-full flex items-center justify-center shadow-[inset_0_3px_8px_rgba(255,255,255,0.8),0_0_15px_#39ff14]">
                <svg className="w-5 h-5 text-black ml-1 scale-110 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </button>
            {/* Extending Line with Gradient */}
            <div className="absolute left-16 w-[14vw] h-[2px] bg-gradient-to-r from-[#39ff14] to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="flex flex-col gap-4 font-medium text-gray-400 text-[10px] tracking-[0.7em] md:tracking-[0.9em] ml-2">
            <span className="opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">A D A P T I V E</span>
            <span className="opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">S E C U R I T Y .</span>
          </div>
        </div>

        {/* CENTER COMPONENT - Main Headings */}
        <div className="w-full flex-1 flex flex-col justify-center items-start pl-[2%] pr-[10%]">
          
          {/* Pill Badge intense glow */}
          <div className="inline-block px-5 py-2 rounded-full border border-[#39ff14]/60 text-[#39ff14] text-[11px] font-bold tracking-[0.2em] mb-12 bg-[#39ff14]/5 backdrop-blur-md uppercase shadow-[0_0_20px_rgba(57,255,20,0.2)]">
            Self-Assessment Tool
          </div>
          
          {/* Hero Typography with Gradient Clipping Fade */}
          <h1 className={`${bruno.className} text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] leading-[1.1] mb-12 uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
            {/* Line 1 */}
            <div className="flex whitespace-nowrap overflow-visible">
              <span className="text-white pr-[0.3em] text-shine">UNCOVER</span>
              <span className="bg-gradient-to-r from-white to-[#050505] text-transparent bg-clip-text text-shine">YOUR</span>
            </div>
            {/* Line 2 */}
            <div className="flex whitespace-nowrap mt-2">
              <span className="text-white pr-[0.3em] text-shine">CYBER</span>
              <span className="bg-gradient-to-r from-white via-white/70 to-[#050505] text-transparent bg-clip-text text-shine">HYGIENE</span>
            </div>
            {/* Line 3 */}
            <div className="mt-2 text-white text-shine">
              SCORE.
            </div>
          </h1>

          {/* Action Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full max-w-2xl mt-4">
            
            {/* Language Selector */}
            <div className="relative group z-30 flex items-center bg-[#0a0a0a] border border-white/20 rounded-full px-4 py-3 hover:border-[#39ff14]/60 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer">
              <span className="text-gray-400 text-sm mr-3">🌐</span>
              <select 
                value={selectedLang} 
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-white text-sm outline-none cursor-pointer appearance-none pr-6 font-semibold tracking-wider font-sans focus:ring-0 w-[140px]"
                style={{ WebkitAppearance: 'none' }}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-[#111] text-white p-2">
                    {l.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs text-[#39ff14]">▼</div>
            </div>

            {/* Dynamic Slider Switch wrapper */}
            <div className={`flex items-center rounded-l-full rounded-r-full border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl p-1.5 flex-1 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] h-[60px] group relative`}>
               
               {/* Arrow container that creatively vanishes to pull the button over */}
               <div className={`transition-all duration-500 ease-in-out flex items-center overflow-hidden h-full ${isSwiping ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                 <div className="w-[100px] flex items-center text-[#39ff14]/80 pl-8 group-hover:text-[#39ff14] transition-colors drop-shadow-[0_0_5px_rgba(57,255,20,0.4)] shrink-0">
                   <svg className="w-10 h-5" viewBox="0 0 30 15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10L2 5l5-5" strokeWidth="1.5"/><line x1="2" y1="5" x2="30" y2="5" /></svg>
                 </div>
               </div>
               
               <button 
                onClick={handleStartAudit}
                className={`flex shrink-0 items-center justify-center rounded-full text-[13px] font-bold tracking-[0.08em] transition-all duration-500 ease-in-out whitespace-nowrap shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.8)] 
                ${isSwiping ? 'bg-white text-black h-full w-[calc(100%-12px)] shadow-[0_0_40px_#fff] scale-100' : 'bg-[#39ff14] hover:bg-[#b0ff9c] text-black h-full px-8 w-auto'}`}
              >
                {getTranslation(selectedLang, 'start')}
              </button>
            </div>
            
          </div>
          
          {/* Subtle descriptive text below input */}
          <p className="text-gray-300 font-light text-[14px] leading-relaxed max-w-[460px] mt-12 pr-4 border-t border-white/10 pt-8 drop-shadow-[0_0_5px_rgba(0,0,0,1)]">
            A structured, 30-question audit across 6 domains. Get your personal security score and a prioritized action plan instantly, with zero data stored server-side.
          </p>
        </div>
        
      </div>

      {/* =========================================
          HARDENED PRIVACY ENGINE (BENTO GRID 1)
          ========================================= */}
      <section className="relative z-20 w-full max-w-[1440px] mx-auto px-8 lg:px-16 mt-32">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#39ff14]/30 text-[#39ff14] text-[10px] font-bold tracking-[0.4em] mb-6 bg-[#39ff14]/5 uppercase">
            PRIVACY FIRST
          </div>
          <h2 className={`${bruno.className} text-3xl lg:text-5xl uppercase tracking-tight`}>
            Hardened Logic, <br /> <span className="opacity-60">Zero Data Sharing</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Real-time Prevention (4 cols) */}
          <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group hover:border-[#39ff14]/30 transition-all overflow-hidden relative min-h-[380px]">
             <div className="z-10">
                <h3 className="text-xl font-bold mb-3 tracking-wide">Real-Time Threat <br /> Prevention</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-[220px]">Local-only pattern matching for instant vulnerability detection.</p>
             </div>
             <img src="/sec_visual_1.png" className="w-[120%] absolute -bottom-10 -right-10 opacity-30 group-hover:opacity-60 transition-all group-hover:scale-110" alt="Scanning Visual" />
          </div>

          {/* Local Engine (4 cols - Highlighted) */}
          <div className="lg:col-span-4 bg-[#0c0c0c] border border-[#39ff14]/40 rounded-[40px] p-10 flex flex-col items-center justify-center text-center text-white relative group overflow-hidden">
             <div className={`${bruno.className} text-[10px] tracking-[0.4em] mb-6 text-[#39ff14]`}>CORE ENGINE</div>
             <h3 className="text-3xl font-black mb-8 leading-tight uppercase relative z-10 italic">Local <br /> Processing</h3>
             <img src="/sec_visual_2.png" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all scale-125" alt="Core Visual" />
             <div className="z-10 bg-[#39ff14] text-black px-8 py-3 rounded-full text-xs font-bold tracking-widest cursor-pointer hover:scale-105 transition-transform">
               LEARN MORE
             </div>
          </div>

          {/* Secure Padlock (4 cols) */}
          <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between group hover:border-[#39ff14]/30 transition-all overflow-hidden relative min-h-[380px]">
             <div className="z-10">
                <h3 className="text-xl font-bold mb-3 tracking-wide">Multi-Node <br /> Verification</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-[220px]">Seamless integration with zero server-side handshake latency.</p>
             </div>
             <img src="/sec_visual_3.png" className="w-[100%] absolute -bottom-12 -right-8 opacity-40 group-hover:opacity-80 transition-all group-hover:rotate-[5deg]" alt="Padlock Visual" />
          </div>

        </div>

      </section>

      {/* =========================================
          PROTECTION SCALE (SIMPLIFIED GRID)
          ========================================= */}
      <section className="relative z-20 w-full max-w-[1440px] mx-auto px-8 lg:px-16 mt-32">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Card 1: Large Scale */}
           <div className="md:col-span-2 bg-[#0c0c0c] border border-white/5 rounded-[40px] p-10 flex flex-col lg:flex-row items-center gap-10 hover:border-white/10 transition-colors">
              <div className="w-24 h-24 bg-[#39ff14]/10 rounded-full flex items-center justify-center border border-[#39ff14]/20">
                 <span className="text-4xl">🚀</span>
              </div>
              <div className="flex-1">
                 <h3 className="text-2xl font-bold mb-2">Future-Proof Your Security</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">Anticipate emerging threats with adaptive heuristics that learn from global attack patterns without ever seeing your data.</p>
              </div>
           </div>

           {/* Card 2: Scale */}
           <div className="bg-[#1a2d1a]/20 border border-[#39ff14]/20 rounded-[40px] p-10 flex flex-col justify-between hover:bg-[#39ff14]/5 transition-colors">
              <h3 className="text-xl font-bold text-white mb-6">Scale <br /> Without Fear</h3>
              <div className="text-4xl text-[#39ff14] font-black opacity-30">99.9%</div>
           </div>

        </div>

      </section>

      {/* =========================================
          EXTENSION ADVERTISEMENT SECTION
          ========================================= */}
      <section className="relative z-20 w-full max-w-[1440px] mx-auto px-8 lg:px-16 mt-32">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-[#39ff14] text-xs font-bold tracking-[0.3em] uppercase mb-4">
              <div className="w-8 h-[1px] bg-[#39ff14]"></div>
              Real-time Protection
            </div>
            <h2 className={`${bruno.className} text-4xl lg:text-5xl uppercase leading-tight`}>
              Defend Beyond <br /> <span className="text-[#39ff14]">The Audit.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed border-l border-white/10 pl-6">
            Install the Awareshield Browser Guard to proactively block phishing, analyze password strength, and trace cookie leaks locally in your browser.
          </p>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          
          {/* Card 1: Link Safety */}
          <div className="group bg-[#0c0c0c]/60 backdrop-blur-md border border-white/5 p-8 rounded-[32px] hover:border-[#39ff14]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,255,20,0.05)]">
            <div className="w-12 h-12 bg-[#39ff14]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#39ff14]/20 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">🔗</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Link Safety Engine</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Instantly scans navigated URLs against our local intelligence database to block high-risk phishing attempts.
            </p>
          </div>

          {/* Card 2: Password Guardian */}
          <div className="group bg-[#0c0c0c]/60 backdrop-blur-md border border-white/5 p-8 rounded-[32px] hover:border-[#39ff14]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,255,20,0.05)] text-[#39ff14]">
             <div className="w-12 h-12 bg-[#39ff14]/20 rounded-2xl flex items-center justify-center mb-8 border border-[#39ff14]/40 group-hover:scale-110 transition-transform">
                <span className="text-2xl text-white">🛡️</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Password Guardian</h3>
             <p className="text-gray-300 text-sm leading-relaxed">
               Real-time local strength analysis with a high-entropy generator to ensure your credentials stay uncrackable.
             </p>
          </div>

          {/* Card 3: Privacy Shield */}
          <div className="group bg-[#0c0c0c]/60 backdrop-blur-md border border-white/5 p-8 rounded-[32px] hover:border-[#39ff14]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(57,255,20,0.05)]">
            <div className="w-12 h-12 bg-[#39ff14]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#39ff14]/20 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">👁️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cookie Detection</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Monitors and alerts you to excessive tracking-cookie density, placing your data privacy back in your own hands.
            </p>
          </div>

        </div>

        {/* Download & Instructions CTA */}
        <div className="bg-gradient-to-br from-[#0c0c0c] to-[#050505] border border-white/10 rounded-[40px] p-8 lg:p-14 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
           
           {/* Decorative background glow for CTA */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#39ff14]/10 blur-[80px] rounded-full pointer-events-none"></div>

           <div className="flex-1 text-center lg:text-left z-10">
             <div className={`${bruno.className} text-[#39ff14] text-[10px] tracking-[0.5em] mb-4`}>LAUNCHING NOW</div>
             <h2 className={`${bruno.className} text-3xl text-white mb-6 uppercase`}>Ready to Armor Up?</h2>
             <p className="text-gray-400 max-w-md mx-auto lg:mx-0 text-xs leading-relaxed mb-10">
               Experience the web with zero-data-storage security. Download the local Awareshield Guard Extension today.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href="/awareshield-extension.zip" 
                  download 
                  className="bg-[#39ff14] hover:bg-[#b0ff9c] text-black font-bold py-3 px-8 rounded-full text-xs transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  DOWNLOAD .ZIP
                </a>
                <button 
                  onClick={() => setShowExtInstructions(!showExtInstructions)}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold py-3 px-6 rounded-full text-xs transition-all"
                >
                  INSTALL GUIDE
                </button>
             </div>
           </div>

           {/* Preview Mockup of Extension (Visual placeholder) */}
           <div className="w-[280px] h-[180px] bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 relative shadow-inner z-10 shrink-0">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-3">
                 <div className="w-8 h-8 rounded-lg bg-[#39ff14]/20 flex items-center justify-center">
                    <HexLogo />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Awareshield Guard</span>
                    <span className="text-[8px] text-[#39ff14] font-mono">Local Active</span>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#39ff14]"></div>
                 </div>
                 <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono tracking-tighter">
                    <span>Privacy Scan</span>
                    <span>100% Local</span>
                 </div>
              </div>
           </div>

        </div>

        {/* Dynamic Instruction Modal/Reveal */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showExtInstructions ? 'max-h-[1000px] opacity-100 mt-12' : 'max-h-0 opacity-0'}`}>
           <div className="bg-[#0c0c0c]/80 backdrop-blur-xl border border-[#39ff14]/30 rounded-[32px] p-8 lg:p-12">
              <h3 className={`${bruno.className} text-xl text-white mb-8 border-b border-white/5 pb-4 tracking-widest`}>
                4 STEPS TO DEPLOYMENT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { step: "01", title: "Extract Files", desc: "Download the .zip and extract it to a folder on your computer." },
                   { step: "02", title: "Open Chrome", desc: "Navigate to chrome://extensions in your browser address bar." },
                   { step: "03", title: "Dev Mode", desc: "Enable 'Developer mode' using the toggle in the top-right corner." },
                   { step: "04", title: "Load Unpacked", desc: "Click 'Load unpacked' and select the extracted extension folder." }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col">
                      <span className="text-4xl font-black text-[#39ff14]/20 mb-4">{item.step}</span>
                      <strong className="text-white text-lg mb-2">{item.title}</strong>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </section>
      
      {/* =========================================
          TESTIMONIALS SECTION (GRID 3)
          ========================================= */}
      <section className="relative z-20 w-full max-w-[1440px] mx-auto px-8 lg:px-16 mt-40">
        
        <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-12">
           <div className="max-w-xl">
              <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 text-gray-400 text-[10px] font-bold tracking-[0.4em] mb-6 uppercase">SOCIAL PROOF</div>
              <h2 className={`${bruno.className} text-4xl lg:text-5xl uppercase leading-tight`}>
                Trusted by <br /> <span className="opacity-40">The Vigilant</span>
              </h2>
           </div>
           <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">←</button>
              <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">→</button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           <div className="bg-[#080808] border border-white/5 p-12 rounded-[48px] relative group hover:border-[#39ff14]/20 transition-all">
              <span className="text-6xl text-[#39ff14]/10 absolute top-10 left-10 group-hover:text-[#39ff14]/20 transition-colors">“</span>
              <p className="text-xl text-gray-300 leading-relaxed mb-12 relative z-10">
                Awareshield has fundamentally shifted how we handle internal security audits. The localized reporting and real-time extension are game changers for our distributed team.
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/5 rounded-full"></div>
                 <div>
                    <strong className="text-white block text-sm">Sarah Chen</strong>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">Lead Architect, CyberDyne</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#080808] border border-white/5 p-12 rounded-[48px] relative group hover:border-[#39ff14]/20 transition-all">
              <span className="text-6xl text-[#39ff14]/10 absolute top-10 left-10 group-hover:text-[#39ff14]/20 transition-colors">“</span>
              <p className="text-xl text-gray-300 leading-relaxed mb-12 relative z-10">
                Simple, fast, and entirely local. No data storage means no privacy concerns. It's the most transparent security tool we've ever integrated.
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/5 rounded-full"></div>
                 <div>
                    <strong className="text-white block text-sm">Marcus Thorne</strong>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">CTO, VIGILANT.IO</span>
                 </div>
              </div>
           </div>

        </div>

      </section>

      {/* =========================================
          SITE FOOTER
          ========================================= */}
      {/* <footer className="relative z-20 w-full max-w-[1440px] mx-auto px-8 lg:px-16 mt-32 border-t border-white/5 pt-20">
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-24">
           
           <div className="col-span-2 lg:col-span-3">
              <div className="flex items-center gap-3 mb-6">
                 <HexLogo />
                 <span className={`${bruno.className} text-xl tracking-[0.2em] text-white`}>Awareshield</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs mb-8">
                Uncompromising localized cybersecurity auditing and real-time browser protection. 
              </p>
              <div className="flex gap-4">
                 {['X', 'LinkedIn', 'Github'].map(s => (
                   <span key={s} className="text-[10px] text-gray-500 font-bold tracking-widest hover:text-[#39ff14] cursor-pointer transition-colors uppercase">{s}</span>
                 ))}
              </div>
           </div>

           <div>
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">Product</h4>
              <ul className="space-y-3 text-gray-500 text-[10px]">
                 <li className="hover:text-white cursor-pointer transition-colors">Security Audit</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Browser Guard</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Local Engine</li>
              </ul>
           </div>

           <div>
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">Resources</h4>
              <ul className="space-y-3 text-gray-500 text-[10px]">
                 <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Security Blog</li>
              </ul>
           </div>

           <div>
              <h4 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">Privacy</h4>
              <ul className="space-y-3 text-gray-500 text-[10px]">
                 <li className="hover:text-white cursor-pointer transition-colors hover:text-[#39ff14]">Zero Data Disclosure</li>
                 <li className="hover:text-white cursor-pointer transition-colors">Local Encryption</li>
              </ul>
           </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 py-8 gap-4">
           <span className="text-[10px] text-gray-600 font-medium">© 2026 AWARESHIELD. ALL RIGHTS RESERVED.</span>
           <div className="flex items-center gap-8">
              <span className="text-[10px] text-gray-600 hover:text-white transition-colors cursor-pointer uppercase">Terms of Service</span>
              <span className="text-[10px] text-gray-600 hover:text-white transition-colors cursor-pointer uppercase">Privacy Settings</span>
           </div>
        </div>

      </footer> */}

      {/* BACKGROUND NEON GLOWS FOR FOOTER AREA */}
      {/* <div className="absolute bottom-0 right-[-5%] w-[40vw] h-[40vw] bg-[#39ff14] rounded-full blur-[160px] opacity-[0.1] pointer-events-none mix-blend-screen"></div> */}

      {/* BOTTOM RIGHT STATS (Exactly placed) */}
      {/* <div className="fixed bottom-12 right-12 lg:right-24 hidden md:flex items-center gap-8 z-[50] bg-black/40 px-6 py-4 rounded-full backdrop-blur-md border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <div className="flex items-baseline gap-2">
           <span className={`${bruno.className} text-white text-2xl lg:text-3xl font-bold tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}>0</span> 
           <span className="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase ml-1">Data Stored</span>
         </div>
         <span className="text-[#39ff14] font-light text-2xl opacity-70 drop-shadow-[0_0_10px_#39ff14]">+</span>
         <div className="flex items-baseline gap-2">
           <span className={`${bruno.className} text-white text-2xl lg:text-3xl font-bold tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}>100%</span> 
           <span className="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase ml-1">Private</span>
         </div>
      </div> */}

    </main>
  );
}
