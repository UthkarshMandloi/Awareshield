'use client';

import { toPng } from 'html-to-image';
import { useState } from 'react';
import { getTranslation } from '../utils/i18n';

interface BadgeCanvasProps {
  overallScore: number;
  badgeTier: string;
  lang: string;
  masteredDomain: string;
}

export default function BadgeCanvas({ overallScore, badgeTier, lang, masteredDomain }: BadgeCanvasProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // We change the badge accent color based on their tier!
  let tierColor = 'text-[#39ff14]';
  let borderColor = 'border-[#39ff14]';
  let glowEffect = 'shadow-[0_0_50px_rgba(57,255,20,0.4)]';

  if (badgeTier === 'Average') {
    tierColor = 'text-yellow-400';
    borderColor = 'border-yellow-400';
    glowEffect = 'shadow-[0_0_50px_rgba(250,204,21,0.4)]';
  } else if (badgeTier === 'Needs Improvement') {
    tierColor = 'text-red-500';
    borderColor = 'border-red-500';
    glowEffect = 'shadow-[0_0_50px_rgba(239,68,68,0.4)]';
  }

  const handleDownload = async () => {
    setIsGenerating(true);
    const element = document.getElementById('badge-capture-area');
    
    if (element) {
      try {
        const dataUrl = await toPng(element, { 
          cacheBust: true, 
          pixelRatio: 2,
          backgroundColor: '#050505',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            margin: '0',
          }
        });
        
        // Create a fake link to trigger the download
        const link = document.createElement('a');
        link.download = `Awareshield-${badgeTier.replace(/\s+/g, '')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating badge:", error);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-transparent w-full pb-6 pt-4">
      {/* Container carefully sized to fit the badge + ribbon drop shadows without cropping */}
      <div id="badge-capture-area" className="w-[340px] h-[340px] relative flex flex-col items-center justify-center bg-[#050505]">
        
        {/* The Main Circular Medallion Coin Outer Base */}
        <div 
          className="w-[280px] h-[280px] rounded-full relative flex flex-col items-center justify-center z-10"
          style={{
             background: 'linear-gradient(135deg, #444 0%, #1a1a1a 50%, #030303 100%)',
             boxShadow: '0 10px 30px rgba(0,0,0,0.9), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(0,0,0,0.9)'
          }}
        >
          {/* Inner Textured Core */}
          <div 
            className={`w-[250px] h-[250px] rounded-full border-[6px] flex flex-col items-center justify-center overflow-hidden relative shadow-[inset_0_20px_50px_rgba(0,0,0,0.9)] ${borderColor}`}
            style={{
               background: 'radial-gradient(circle at 50% 20%, #151515 0%, #000 100%)',
            }}
          >
             {/* Neon internal core glow */}
             <div className={`absolute top-0 left-0 right-0 h-[100px] ${tierColor} bg-current opacity-[0.15] blur-[30px]`}></div>
             
             {/* Top Arch Label */}
             <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 border-b-2 border-white/10 pb-2.5 flex justify-center shadow-[0_2px_0_rgba(0,0,0,1)]">
                 <span className="text-gray-300 font-bold tracking-[0.2em] text-[10px] uppercase shadow-black drop-shadow-[0_2px_3px_black]">Security Audit</span>
             </div>

             {/* Center Score Readout */}
             <div className="mt-6 flex flex-col items-center relative z-20">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-0 ${tierColor} drop-shadow-[0_0_8px_currentColor]`}>
                   {badgeTier === 'Good' ? 'EXCELLENT' : badgeTier}
                </span>
                <div className="text-[85px] leading-[1] font-black text-white drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] shadow-black">
                  {overallScore}
                </div>
             </div>
             
             {/* Internal Label Bottom */}
             <div className="absolute bottom-[28px] flex flex-col items-center w-full px-4 text-center">
                 <span className="text-[9px] text-[#39ff14] font-bold uppercase tracking-[0.3em] opacity-80 shadow-black drop-shadow-[0_2px_2px_black]">Points / 100</span>
                 {masteredDomain && (
                   <span className="text-[6.5px] text-gray-300 mt-1.5 uppercase tracking-[0.2em] bg-black/50 px-2 py-0.5 rounded-full border border-white/5 truncate max-w-[180px]">
                     ACHIEVEMENT: {getTranslation(lang, masteredDomain) || masteredDomain}
                   </span>
                 )}
             </div>
          </div>
        </div>

        {/* The Bottom Ribbon overlapping the Coin directly - Completes the "Pin Badge" aesthetic */}
        <div 
          className="absolute bottom-6 z-20 w-[240px] py-4 rounded-xl border-t-[3px] border-b-2 border-r-[1px] border-l-[1px] flex items-center justify-center"
          style={{
             background: 'linear-gradient(180deg, #1c1c1c 0%, #0a0a0a 100%)',
             borderColor: 'rgba(255,255,255,0.15) rgba(255,255,255,0.05) rgba(0,0,0,1) rgba(255,255,255,0.05)',
             boxShadow: '0 15px 25px rgba(0,0,0,1), 0 5px 10px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.05)'
          }}
        >
           <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${tierColor}`}></div>
           <span className="text-white font-black uppercase tracking-[0.15em] text-[10px] flex items-center gap-2 drop-shadow-[0_2px_4px_black]">
             <span className="text-[#39ff14] text-sm drop-shadow-[0_0_5px_currentColor]">🛡️</span>
             VERIFIED BY AWARESHIELD
           </span>
        </div>

      </div>

      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="mt-8 px-8 py-3.5 bg-[#39ff14] text-black font-bold tracking-widest uppercase text-xs rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{isGenerating ? getTranslation(lang, 'generating') : getTranslation(lang, 'badge')}</span>
      </button>
    </div>
  );
}