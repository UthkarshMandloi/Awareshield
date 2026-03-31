'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

import Quiz from '../../components/Quiz';
import RadarChart from '../../components/RadarChart';
import BadgeCanvas from '../../components/BadgeCanvas';
import PrintableReport from '../../components/PrintableReport';
import NavBar from '../../components/NavBar';
import { UserResponse, Question } from '../../types';
import { calculateScores } from '../../utils/scoring';
import { getTopRecommendations } from '../../utils/recommendations';
import { loadQuestions } from '../../utils/loadQuestions';
import { getTranslation } from '../../utils/i18n';

function AnimatedCharacter({ tier }: { tier: string }) {
  if (tier === 'Good') {
    return (
      <div className="w-40 h-40 relative flex items-center justify-center animate-bounce duration-3000">
        <div className="absolute inset-0 bg-[#39ff14]/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="text-8xl drop-shadow-[0_0_20px_#39ff14] z-10">🛡️</div>
      </div>
    );
  }
  if (tier === 'Average') {
    return (
      <div className="w-40 h-40 relative flex items-center justify-center animate-pulse">
        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
        <div className="text-8xl drop-shadow-[0_0_20px_#eab308] z-10">⚠️</div>
      </div>
    );
  }
  
  return (
    <div className="w-40 h-40 relative flex items-center justify-center">
      <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-ping"></div>
      <div className="text-8xl drop-shadow-[0_0_20px_#ef4444] z-10 origin-bottom">🚨</div>
    </div>
  );
}

function AuditContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [questionsBank, setQuestionsBank] = useState<Question[] | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [topActions, setTopActions] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [auditResponses, setAuditResponses] = useState<UserResponse[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadQuestions(lang).then(setQuestionsBank);
  }, [lang]);

  const handleQuizComplete = (responses: UserResponse[]) => {
    const results = calculateScores(responses);
    setAuditResponses(responses);
    setFinalResults(results);
    const actions = getTopRecommendations(responses, questionsBank || []);
    setTopActions(actions);
    setIsFinished(true);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Target the hidden PrintableReport specifically for PDF construction
      const dataUrl = await toPng(reportRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { margin: '0' }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Awareshield_Audit_Report_${lang}.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
    }
    setIsGeneratingPdf(false);
  };

  if (!questionsBank) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#39ff14] text-xl animate-pulse tracking-widest">
        INITIALIZING SECURITY MODULES...
      </div>
    );
  }

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-[1440px] mx-auto pb-20">
      {!isFinished ? (
        <Quiz onComplete={handleQuizComplete} questionsBank={questionsBank} lang={lang} />
      ) : (
        <>
        {/* Hidden Monochromatic PDF-Optimized Report */}
        <div style={{ position: 'absolute', top: '-15000px', left: '-15000px' }} className="print-only-container">
          <div ref={reportRef}>
            <PrintableReport 
              responses={auditResponses} 
              questionsBank={questionsBank} 
              finalResults={finalResults} 
              lang={lang} 
            />
          </div>
        </div>

        {/* Standard Web App Dashboard */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Chart, Score, Character and Full Report Download */}
          <div className="flex-[3] flex flex-col gap-6">
            <div className="bg-[#0c0c0c]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#39ff14]/20 shadow-[0_0_40px_rgba(57,255,20,0.1)]">
              <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {getTranslation(lang, 'posture')}
              </h2>
              <RadarChart domainScores={finalResults.domainScores} lang={lang} />
            </div>

            {/* Empty space filler for Score & Character Status */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#39ff14]/20 flex items-center justify-between shadow-[0_0_20px_rgba(57,255,20,0.05)]">
              <div className="flex flex-col">
                <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Overall Security Rating</p>
                <div className="text-6xl font-black mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] text-white">
                  {finalResults.overallScore} 
                  <span className="text-xl text-gray-500 font-normal"> / 100</span>
                </div>
                <div className={`mt-2 font-bold uppercase tracking-widest text-lg ${finalResults.badgeTier === 'Good' ? 'text-[#39ff14]' : finalResults.badgeTier === 'Average' ? 'text-yellow-400' : 'text-red-500'}`}>
                  {finalResults.badgeTier === 'Good' ? 'EXCELLENT DEFENSE' : finalResults.badgeTier === 'Average' ? 'MODERATE RISK' : 'HIGH RISK EXPOSURE'}
                </div>
                
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                  className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#39ff14] text-white text-xs font-bold tracking-widest rounded-full transition-all flex items-center gap-2 max-w-max"
                >
                  {isGeneratingPdf ? getTranslation(lang, 'generating') : getTranslation(lang, 'download')}
                </button>
              </div>

              {/* Character Animated Status */}
              <AnimatedCharacter tier={finalResults.badgeTier} />
            </div>
          </div>

          {/* Right Column: Score, Actions, and Badge */}
          <div className="flex-[2] flex flex-col gap-8">
            
            {/* Top Priority Actions */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#39ff14]/20 max-h-[500px] flex flex-col shadow-[0_0_30px_rgba(57,255,20,0.08)]">
              <h2 className="text-xl font-bold text-white mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                {getTranslation(lang, 'priority')}
              </h2>
              {topActions.length === 0 ? (
                <p className="text-[#39ff14] font-bold tracking-widest text-center py-8 drop-shadow-[0_0_8px_#39ff14]">
                  {getTranslation(lang, 'systemsSecure')}
                </p>
              ) : (
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                  {topActions.map((action, index) => (
                    <div key={index} className="bg-[#111111]/90 p-5 rounded-2xl border border-white/5 hover:border-[#39ff14]/40 transition-colors shadow-[0_5px_15px_rgba(0,0,0,0.5)] group">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5 shadow-[0_0_10px_rgba(57,255,20,0.2)] group-hover:bg-[#39ff14] group-hover:text-black transition-colors shrink-0">
                          {index + 1}
                        </div>
                        <h3 className="font-semibold text-gray-200 text-sm leading-tight pt-0.5">{action.title}</h3>
                      </div>
                      <p className="text-xs text-gray-500 pl-10 leading-relaxed group-hover:text-gray-400 transition-colors">{action.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* The Badge Generator */}
            <div className="bg-[#0c0c0c]/80 backdrop-blur-xl p-0 rounded-3xl border border-[#39ff14]/20 shadow-[0_0_30px_rgba(57,255,20,0.08)] flex justify-center border-t-2 border-t-[#39ff14]/40 overflow-hidden">
              <BadgeCanvas 
                overallScore={finalResults.overallScore} 
                badgeTier={finalResults.badgeTier} 
                lang={lang}
                masteredDomain={finalResults.masteredDomain}
              />
            </div>

          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col relative selection:bg-[#39ff14]/40 overflow-x-hidden">
      
      {/* BACKGROUND NEON GLOWS */}
      <div className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-[#39ff14] rounded-full blur-[160px] opacity-[0.25] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[55vw] h-[55vw] bg-[#39ff14] rounded-full blur-[140px] opacity-[0.2] pointer-events-none mix-blend-screen z-0"></div>
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-[#39ff14] rounded-full blur-[200px] opacity-[0.12] pointer-events-none mix-blend-screen z-0"></div>

      <NavBar />
      
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#39ff14] tracking-widest animate-pulse">LOADING...</div>}>
        <AuditContent />
      </Suspense>
    </main>
  );
}