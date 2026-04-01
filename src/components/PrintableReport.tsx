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

export default function PrintableReport({
  responses,
  questionsBank,
  finalResults,
  lang,
}: PrintableReportProps) {
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

  const criticalPage1 = critical.slice(0, 5);
  const criticalPage2 = critical.slice(5);

  const suggestedPage1 = suggested.slice(0, 8);
  const suggestedPage2 = suggested.slice(8);

  return (
    <div className="w-full flex flex-col items-center bg-gray-200 py-8 print:bg-white print:py-0">

      {/* ================= PAGE 1 ================= */}
      <div className="pdf-page bg-white text-black w-[1200px] min-h-[1600px] p-12 flex flex-col font-sans relative shadow-xl print:shadow-none print:mb-0 mb-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-black pb-8 mb-10 w-full">
          <div className="flex flex-col">
            <h1 className="text-6xl font-black uppercase tracking-widest text-black">Awareshield</h1>
            <h2 className="text-2xl font-bold tracking-[0.2em] text-gray-500 mt-2">
              Executive Security Request
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-8xl font-black">{overallScore}</div>
            <p className="text-sm font-bold tracking-widest uppercase text-gray-500">
              Overall Audit Score
            </p>
          </div>
        </div>

        <div className="flex gap-12 w-full flex-1">
          
          {/* LEFT COLUMN */}
          <div className="flex-[3] flex flex-col gap-10">
            
            {/* CHART */}
            <div className="border border-gray-300 p-8 pt-4 rounded-[32px] bg-gray-50">
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                Defense Posture Vector
              </h3>
              <RadarChart domainScores={domainScores} lang={lang} isPrintTheme={true} />
            </div>

            {/* CRITICAL ACTIONS */}
            <div className="flex flex-col gap-6 w-full">
              {criticalPage1.length > 0 && (
                <div className="border border-black bg-black text-white p-8 rounded-2xl flex flex-col shadow-lg">
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/20 pb-4 flex items-center gap-3">
                    <span className="text-3xl">⚠️</span> CRITICAL ACTION REQUIRED
                  </h3>
                  <div className="flex flex-col gap-5">
                    {criticalPage1.map((action, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="font-bold text-xl mt-0.5">{i + 1}.</div>
                        <div className="flex flex-col gap-1">
                          <strong className="text-lg font-bold tracking-wide">{action.title}</strong>
                          <p className="text-gray-300 text-sm leading-relaxed">{action.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {critical.length === 0 && suggested.length === 0 && (
                <div className="p-8 border-2 border-gray-300 rounded-2xl text-center">
                  <h2 className="text-2xl font-black text-gray-400">ZERO VULNERABILITIES DETECTED</h2>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-[2] flex flex-col gap-6">
            <h3 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2">
              Domain Certifications
            </h3>
            
            <div className="flex flex-col gap-6">
              {domains.map((d, i) => {
                if (d.tier === 'None') return null;

                return (
                  <div
                    key={i}
                    className="w-full flex items-center justify-between border border-gray-300 rounded-full p-2 pr-6 shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl ${
                          d.tier === 'Expert'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-gray-600'
                        }`}
                      >
                        {d.score}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                          {getTranslation(lang, d.domain) || d.domain}
                        </span>
                        <strong
                          className={`tracking-widest capitalize text-[15px] ${
                            d.tier === 'Expert'
                              ? 'font-black text-black'
                              : 'font-semibold text-gray-600'
                          }`}
                        >
                          {d.badgeLabel}
                        </strong>
                      </div>
                    </div>

                    <div className="text-2xl">{d.tier === 'Expert' ? '🛡️' : '✓'}</div>
                  </div>
                );
              })}

              {domains.every((d) => d.tier === 'None') && (
                <div className="p-8 text-center text-gray-400 font-bold uppercase">
                  No Certifications Earned
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full border-t border-gray-300 mt-12 pt-6 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span>Verified by Awareshield</span>
          <span>Generated Securely via Local Client</span>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      {(criticalPage2.length > 0 || suggestedPage1.length > 0 || suggestedPage2.length > 0) && (
        <div className="pdf-page bg-white text-black w-[1200px] min-h-[1600px] p-12 flex flex-col font-sans relative shadow-xl print:shadow-none print:mb-0 mb-8">
          
          <div className="border-b-4 border-black pb-6 mb-10">
            <h2 className="text-4xl font-black uppercase tracking-widest text-black">
              Extended Security Actions
            </h2>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            {criticalPage2.length > 0 && (
              <div className="border border-black bg-black text-white p-8 rounded-2xl flex flex-col shadow-lg">
                <h3 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/20 pb-4 flex items-center gap-3">
                  <span className="text-3xl">⚠️</span> MORE CRITICAL ACTIONS
                </h3>
                <div className="flex flex-col gap-5">
                  {criticalPage2.map((action, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="font-bold text-xl mt-0.5">{i + 6}.</div>
                      <div className="flex flex-col gap-1">
                        <strong className="text-lg font-bold tracking-wide">{action.title}</strong>
                        <p className="text-gray-300 text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestedPage1.length > 0 && (
              <div className="border-2 border-gray-300 bg-white text-black p-8 rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-4 text-gray-700">
                  SUGGESTED TO PRACTICE
                </h3>
                <div className="flex flex-col gap-5">
                  {suggestedPage1.map((action, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="font-bold text-gray-400 mt-0.5">{i + 1}.</div>
                      <div className="flex flex-col gap-1">
                        <strong className="font-bold text-md text-gray-800">{action.title}</strong>
                        <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestedPage2.length > 0 && (
              <div className="border-2 border-gray-300 bg-white text-black p-8 rounded-2xl flex flex-col">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-4 text-gray-700">
                  MORE SUGGESTED PRACTICES
                </h3>
                <div className="flex flex-col gap-5">
                  {suggestedPage2.map((action, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="font-bold text-gray-400 mt-0.5">{i + 9}.</div>
                      <div className="flex flex-col gap-1">
                        <strong className="font-bold text-md text-gray-800">{action.title}</strong>
                        <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full border-t border-gray-300 mt-12 pt-6 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
            <span>Verified by Awareshield</span>
            <span>Generated Securely via Local Client</span>
          </div>
        </div>
      )}
    </div>
  );
}
