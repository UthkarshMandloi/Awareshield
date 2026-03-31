'use client';

import { toPng } from 'html-to-image';
import { useState } from 'react';
import { getTranslation } from '../utils/i18n';

interface BadgeCanvasProps {
  overallScore: number;
  badgeTier: string;
  lang: string;
}

export default function BadgeCanvas({ overallScore, badgeTier, lang }: BadgeCanvasProps) {
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
        // html-to-image is much more reliable for CSS filters/transforms than html2canvas
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
        link.download = `CyberScore-${badgeTier.replace(/\s+/g, '')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating badge:", error);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-transparent w-full pb-6 pt-2">
      <div 
        id="badge-capture-area" 
        className={`w-72 h-72 flex flex-col items-center justify-center bg-[#050505] rounded-3xl border-2 ${borderColor} ${glowEffect} p-6 relative overflow-hidden`}
      >
        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-current opacity-15 rounded-full blur-2xl ${tierColor}`}></div>
        <p className="text-gray-400 text-sm font-mono tracking-widest mb-2 z-10">CYBERSCORE AUDIT</p>
        <div className="text-7xl font-bold text-white z-10 my-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          {overallScore}
        </div>
        <div className={`text-lg font-bold uppercase tracking-[0.2em] z-10 ${tierColor} drop-shadow-[0_0_8px_currentColor]`}>
          {badgeTier === 'Good' ? 'EXCELLENT' : badgeTier}
        </div>
        <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-8 z-10 border-t border-white/10 pt-2 w-full text-center">🛡️ Verified by CyberScore</p>
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