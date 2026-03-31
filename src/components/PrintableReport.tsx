import React from 'react';
import { UserResponse, Question } from '../types';
import { getGroupedPdfRecommendations } from '../utils/recommendations';
import { getTranslation } from '../utils/i18n';
import RadarChart from './RadarChart';

interface PrintableReportProps {
  responses: UserResponse[];
  questionsBank: Question[];
  finalResults: any;
  lang: string;
}

export default function PrintableReport({ responses, questionsBank, finalResults, lang }: PrintableReportProps) {
  const { critical, suggested } = getGroupedPdfRecommendations(responses, questionsBank);
  const { domainScores, overallScore } = finalResults;

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

  // Common Header Component to repeat or use on Page 1
  const Header = () => (
    <div className="flex justify-between items-center border-b-4 border-black pb-8 mb-10 w-full">
      <div className="flex flex-col">
        <h1 className="text-6xl font-black uppercase tracking-widest text-black">Awareshield</h1>
        <h2 className="text-2xl font-bold tracking-[0.2em] text-gray-500 mt-2">Executive Security Request</h2>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-8xl font-black">{overallScore}</div>
        <p className="text-sm font-bold tracking-widest uppercase text-gray-500">Overall Audit Score</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-200 p-8 flex flex-col items-center gap-8 print:p-0 print:bg-white">
      
      {/* PAGE 1: EXECUTIVE SUMMARY & CRITICAL ACTIONS */}
      <div className="bg-white text-black p-12 w-[1000px] min-h-[1400px] flex flex-col font-sans shadow-2xl print:shadow-none print:w-full page-break-after-always">
        <Header />
        
        <div className="flex flex-col lg:flex-row gap-12 w-full flex-grow">
          <div className="flex-[3] flex flex-col gap-10">
            <div className="border border-gray-300 p-8 pt-4 rounded-[32px] bg-gray-50">
               <h3 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Defense Posture Vector</h3>
               <RadarChart domainScores={domainScores} lang={lang} isPrintTheme={true} />
            </div>

            {critical.length > 0 && (
              <div className="border border-black bg-black text-white p-8 rounded-2xl flex flex-col shadow-lg">
                <h3 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/20 pb-4 flex items-center gap-3">
                  <span className="text-3xl">⚠️</span> CRITICAL ACTION REQUIRED
                </h3>
                <div className="flex flex-col gap-5">
                  {critical.map((action, i) => (
                    <div key={i} className="flex gap-4">
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
          </div>

          <div className="flex-[2] flex flex-col gap-6">
             <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2">Top Certifications</h3>
             <div className="flex flex-col gap-6">
               {domains.filter(d => d.tier === 'Expert').map((d, i) => (
                  <div key={i} className="w-full flex items-center justify-between border border-black rounded-full p-2 pr-6 bg-white">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">{d.score}</div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold uppercase text-gray-400">{d.domain}</span>
                           <strong className="text-xs uppercase font-black">{d.badgeLabel}</strong>
                        </div>
                     </div>
                     <span>🛡️</span>
                  </div>
               ))}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span>Report Page 1 of 2</span>
          <span>Verified by Awareshield</span>
        </div>
      </div>

      {/* PAGE 2: SUGGESTED ACTIONS & FULL DOMAIN BREAKDOWN */}
      <div className="bg-white text-black p-12 w-[1000px] min-h-[1400px] flex flex-col font-sans shadow-2xl print:shadow-none print:w-full">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">Detailed Breakdown & Improvements</h3>
        
        <div className="grid grid-cols-2 gap-10">
          {/* Detailed Recommendations */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-bold uppercase tracking-widest text-gray-500 border-b-2 border-gray-100 pb-2">Practice Recommendations</h4>
            {suggested.map((action, i) => (
              <div key={i} className="border-l-4 border-gray-300 pl-4 py-2">
                <strong className="block font-bold text-lg">{action.title}</strong>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            ))}
          </div>

          {/* Full Domain List */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-bold uppercase tracking-widest text-gray-500 border-b-2 border-gray-100 pb-2">All Domain Scores</h4>
            {domains.map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${d.tier === 'None' ? 'opacity-50 bg-gray-100' : 'bg-white shadow-sm'}`}>
                <span className="font-bold uppercase text-sm tracking-tight">{getTranslation(lang, d.domain) || d.domain}</span>
                <span className="font-black text-xl">{d.score}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span>Report Page 2 of 2</span>
          <span>Security Audit Confidential</span>
        </div>
      </div>

      {/* CSS For Page Breaks */}
      <style jsx>{`
        @media print {
          .page-break-after-always {
            page-break-after: always;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
