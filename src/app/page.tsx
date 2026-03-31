"use client";

import Link from 'next/link';
import { Bruno_Ace_SC, Space_Grotesk } from 'next/font/google';
import { useState, useEffect } from 'react';
import NavBar, { HexLogo } from '../components/NavBar';
import { languages, getTranslation } from '../utils/i18n';

// Advanced futuristic fonts
const bruno = Bruno_Ace_SC({ subsets: ['latin'], weight: '400' });
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en');

  // Simulate site boot-up logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds boot
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={`min-h-screen bg-[#050505] text-white overflow-hidden relative ${grotesk.className} selection:bg-[#39ff14]/40`}>
      
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
      <div className="absolute -top-[15%] -right-[15%] w-[60vw] h-[110vh] rounded-[50%] border-t-[2px] border-l-[1px] border-b-[1px] border-[#39ff14]/50 pointer-events-none -rotate-[15deg] shadow-[inset_10px_0_50px_rgba(57,255,20,0.15),0_0_30px_rgba(57,255,20,0.1)]"></div>
      <div className="absolute top-[20%] right-[11%] w-3 h-3 bg-[#39ff14] rounded-full shadow-[0_0_20px_#39ff14,0_0_40px_#39ff14]">
        {/* Connection line extending left from dot highly illuminated */}
        <div className="absolute top-1/2 right-[100%] w-16 h-[2px] bg-gradient-to-l from-[#39ff14] to-transparent -translate-y-1/2 shadow-[0_0_10px_#39ff14]"></div>
      </div>
      
      {/* Left lower orbit */}
      <div className="absolute bottom-[-20%] left-[-15%] w-[50vw] h-[80vh] rounded-[50%] border-t-[2px] border-r-[1px] border-b-[1px] border-[#39ff14]/50 pointer-events-none rotate-[25deg] shadow-[inset_-10px_0_50px_rgba(57,255,20,0.15),0_0_30px_rgba(57,255,20,0.1)]"></div>
      <div className="absolute bottom-[28%] left-[16%] w-2.5 h-2.5 bg-[#39ff14] rounded-full shadow-[0_0_20px_#39ff14,0_0_40px_#39ff14]"></div>


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
              <span className="text-white pr-[0.3em]">UNCOVER</span>
              <span className="bg-gradient-to-r from-white to-[#050505] text-transparent bg-clip-text">YOUR</span>
            </div>
            {/* Line 2 */}
            <div className="flex whitespace-nowrap mt-2">
              <span className="text-white pr-[0.3em]">CYBER</span>
              <span className="bg-gradient-to-r from-white via-white/70 to-[#050505] text-transparent bg-clip-text">HYGIENE</span>
            </div>
            {/* Line 3 */}
            <div className="mt-2 text-white">
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

            {/* Dark input simulator Button wrapper */}
            <div className="flex items-center rounded-l-full rounded-r-full border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl p-1.5 pl-5 flex-1 shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.02)] h-[60px] group">
              <div className="flex items-center text-[#39ff14]/80 mr-auto px-2 pl-3 group-hover:text-[#39ff14] transition-colors drop-shadow-[0_0_5px_rgba(57,255,20,0.4)]">
                <svg className="w-10 h-5 ml-1" viewBox="0 0 30 15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10L2 5l5-5" strokeWidth="1.5"/><line x1="2" y1="5" x2="30" y2="5" /></svg>
              </div>
              <Link 
                href={`/audit?lang=${selectedLang}`} 
                className="h-full flex items-center bg-[#39ff14] hover:bg-[#b0ff9c] text-black px-8 rounded-full text-[13px] font-bold tracking-[0.08em] transition-all whitespace-nowrap shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.8)]"
              >
                {getTranslation(selectedLang, 'start')}
              </Link>
            </div>
            
          </div>
          
          {/* Subtle descriptive text below input */}
          <p className="text-gray-300 font-light text-[14px] leading-relaxed max-w-[460px] mt-12 pr-4 border-t border-white/10 pt-8 drop-shadow-[0_0_5px_rgba(0,0,0,1)]">
            A structured, 30-question audit across 6 domains. Get your personal security score and a prioritized action plan instantly, with zero data stored server-side.
          </p>
        </div>
        
      </div>

      {/* BOTTOM RIGHT STATS (Exactly placed) */}
      <div className="absolute bottom-12 right-12 lg:right-24 hidden md:flex items-center gap-8 z-20 bg-black/40 px-6 py-4 rounded-full backdrop-blur-md border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
         <div className="flex items-baseline gap-2">
           <span className={`${bruno.className} text-white text-2xl lg:text-3xl font-bold tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}>0</span> 
           <span className="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase ml-1">Data Stored</span>
         </div>
         <span className="text-[#39ff14] font-light text-2xl opacity-70 drop-shadow-[0_0_10px_#39ff14]">+</span>
         <div className="flex items-baseline gap-2">
           <span className={`${bruno.className} text-white text-2xl lg:text-3xl font-bold tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}>100%</span> 
           <span className="text-gray-400 text-[10px] font-semibold tracking-[0.2em] uppercase ml-1">Private</span>
         </div>
      </div>

    </main>
  );
}