import React from 'react';

// --- Localized Dependencies for Canvas Compilation ---
export interface Question {
  id: string;
  domain: string;
  text: string;
  options: { text: string; weight: number }[];
}

export interface UserResponse {
  questionId: string;
  domain: string;
  score: number;
}

const getTranslation = (lang: string, key: string) => key;

const getGroupedPdfRecommendations = (responses: UserResponse[], questionsBank: Question[]) => {
  // Mocked for Canvas preview
  return {
    critical: [
      { title: 'Enable Multi-Factor Authentication', description: 'Immediate action required to secure admin accounts against unauthorized access.' },
      { title: 'Patch Vulnerable Software', description: 'Update critical systems to prevent exploitation of known vulnerabilities.' }
    ],
    suggested: [
      { title: 'Regular Phishing Training', description: 'Conduct monthly security awareness training for all staff members.' }
    ]
  };
};

const RadarChart = ({ domainScores, lang, isPrintTheme }: any) => (
  <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-mono border-2 border-dashed border-gray-300">
    [Radar Chart Visualization Placeholder]
  </div>
);
// ---------------------------------------------------

interface PrintableReportProps {
  responses: UserResponse[];
  questionsBank: Question[];
  finalResults: any;
  lang: string;
}

export default function PrintableReport({ responses, questionsBank, finalResults, lang }: PrintableReportProps) {
  const { critical, suggested } = getGroupedPdfRecommendations(responses, questionsBank);
  const { domainScores = { Security: 85, Privacy: 45, Infrastructure: 20 }, overallScore = 65 } = finalResults || {};

  // Derive domain-specific badges
  const domains = Object.entries(domainScores as Record<string, number>).map(([domain, score]) => {
    let tier = 'None';
    let badgeLabel = '';
    
    if (score >= 80) {
      tier = 'Expert';
      badgeLabel = `${getTranslation(lang, domain) || domain} Lead`;
    } else if (score >= 40) {
      tier = 'Average';
      badgeLabel = `${getTranslation(lang, domain) || domain} Intermediate`;
    }

    return { domain, score, tier, badgeLabel };
  });

  return (
    <div 
      // Removed style={{ overflow: 'hidden' }} here to allow content to span multiple pages
      className="bg-white text-black p-12 w-[1200px] flex flex-col font-sans relative print:overflow-visible"
    >
      {/* HEADER LOGO & TITLE - Added break-inside-avoid */}
      <div className="flex justify-between items-center border-b-4 border-black pb-8 mb-10 w-full break-inside-avoid">
        <div className="flex flex-col">
          <h1 className="text-6xl font-black uppercase tracking-widest text-black">Awareshield</h1>
          <h2 className="text-2xl font-bold tracking-[0.2em] text-gray-500 mt-2">Executive Security Request</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-8xl font-black">{overallScore}</div>
          <p className="text-sm font-bold tracking-widest uppercase text-gray-500">Overall Audit Score</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 w-full">
        
        {/* LEFT COLUMN: Chart + Recommendations */}
        <div className="flex-[3] flex flex-col gap-10">
          
          {/* Radar Chart Block - Added break-inside-avoid */}
          <div className="border border-gray-300 p-8 pt-4 rounded-[32px] bg-gray-50 break-inside-avoid">
             <h3 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Defense Posture Vector</h3>
             <RadarChart domainScores={domainScores} lang={lang} isPrintTheme={true} />
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* CRITICAL ACTIONS - Added break-inside-avoid */}
            {critical.length > 0 && (
              <div className="border border-black bg-black text-white p-8 rounded-2xl flex flex-col shadow-lg break-inside-avoid">
                <h3 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/20 pb-4 flex items-center gap-3">
                  <span className="text-3xl">⚠️</span> CRITICAL ACTION REQUIRED
                </h3>
                <div className="flex flex-col gap-5">
                  {critical.map((action, i) => (
                    // Added break-inside-avoid to individual items to prevent half-printing
                    <div key={i} className="flex gap-4 break-inside-avoid">
                      <div className="font-bold text-xl mt-0.5">{i + 1}.</div>
                      <div className="flex flex-col gap-1">
                        <strong className="text-lg font-bold tracking-wide">{action.title}</strong>
                        <p className="text-gray-300 text-sm">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUGGESTED ACTIONS - Added break-inside-avoid */}
            {suggested.length > 0 && (
              <div className="border-2 border-gray-300 bg-white text-black p-8 rounded-2xl flex flex-col break-inside-avoid">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-4 text-gray-700">
                  SUGGESTED TO PRACTICE
                </h3>
                <div className="flex flex-col gap-5">
                  {suggested.map((action, i) => (
                    <div key={i} className="flex gap-4 break-inside-avoid">
                      <div className="font-bold text-gray-400 mt-0.5">{i + 1}.</div>
                      <div className="flex flex-col gap-1">
                        <strong className="font-bold text-md text-gray-800">{action.title}</strong>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {critical.length === 0 && suggested.length === 0 && (
               <div className="p-8 border-2 border-gray-300 rounded-2xl text-center break-inside-avoid">
                 <h2 className="text-2xl font-black text-gray-400">ZERO VULNERABILITIES DETECTED</h2>
               </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Domain Specific Badges Grid */}
        <div className="flex-[2] flex flex-col gap-6">
           <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 break-inside-avoid">Domain Certifications</h3>
           
           <div className="flex flex-col gap-6">
             {domains.map((d, i) => {
               if (d.tier === 'None') return null; // No badge for very low chart

               return (
                 // Added break-inside-avoid to each badge
                 <div key={i} className="w-full flex items-center justify-between border border-gray-300 rounded-full p-2 pr-6 shadow-sm bg-gray-50 break-inside-avoid">
                    <div className="flex items-center gap-4">
                      {/* Sub-badge coin */}
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl ${
                        d.tier === 'Expert' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-600'
                      }`}>
                         {d.score}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                           {getTranslation(lang, d.domain) || d.domain}
                        </span>
                        <strong className={`tracking-widest capitalize text-[15px] ${d.tier === 'Expert' ? 'font-black text-black' : 'font-semibold text-gray-600'}`}>
                           {d.badgeLabel}
                        </strong>
                      </div>
                    </div>

                    <div className="text-2xl">
                      {d.tier === 'Expert' ? '🛡️' : '✓'}
                    </div>
                 </div>
               );
             })}

             {domains.every(d => d.tier === 'None') && (
               <div className="p-8 text-center text-gray-400 font-bold uppercase break-inside-avoid">
                  No Certifications Earned
               </div>
             )}
           </div>
        </div>

      </div>

      <div className="w-full border-t border-gray-300 mt-12 pt-6 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest break-inside-avoid">
        <span>Verified by Awareshield</span>
        <span>Generated Securely via Local Client</span>
      </div>
    </div>
  );
}
