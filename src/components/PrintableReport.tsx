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

  const domains = Object.entries(domainScores as Record<string, number>).map(
    ([domain, score]) => {
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
    }
  );

  // Split long lists so they can go to page 2 / 3 safely
  const criticalPage1 = critical.slice(0, 5);
  const criticalPage2 = critical.slice(5);

  const suggestedPage1 = suggested.slice(0, 5);
  const suggestedPage2 = suggested.slice(5);

  return (
    <div className="w-full flex flex-col items-center bg-gray-200 py-8 print:bg-white print:py-0">
      
      {/* ================= PAGE 1 ================= */}
      <div className="pdf-page bg-white text-black w-[1123px] h-[1587px] p-10 font-sans mb-8 shadow-xl print:shadow-none print:mb-0">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-widest">Awareshield</h1>
            <h2 className="text-xl font-bold tracking-[0.2em] text-gray-500 mt-2">
              Executive Security Report
            </h2>
          </div>

          <div className="text-right">
            <div className="text-7xl font-black leading-none">{overallScore}</div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-2">
              Overall Audit Score
            </p>
          </div>
        </div>

        {/* TOP SECTION */}
        <div className="flex gap-8 items-start">
          {/* LEFT */}
          <div className="w-[62%] flex flex-col gap-6">
            <div className="border border-gray-300 p-6 rounded-[24px] bg-gray-50">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                Defense Posture Vector
              </h3>
              <RadarChart domainScores={domainScores} lang={lang} isPrintTheme={true} />
            </div>

            {criticalPage1.length > 0 && (
              <div className="border border-black bg-black text-white p-6 rounded-2xl">
                <h3 className="text-xl font-black uppercase tracking-widest mb-5 border-b border-white/20 pb-3">
                  ⚠️ Critical Action Required
                </h3>

                <div className="flex flex-col gap-4">
                  {criticalPage1.map((action, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="font-bold text-lg">{i + 1}.</div>
                      <div>
                        <strong className="text-base font-bold">{action.title}</strong>
                        <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="w-[38%] flex flex-col gap-5">
            <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-black pb-2">
              Domain Certifications
            </h3>

            <div className="flex flex-col gap-4">
              {domains.map((d, i) => {
                if (d.tier === 'None') return null;

                return (
                  <div
                    key={i}
                    className="w-full flex items-center justify-between border border-gray-300 rounded-full p-3 pr-5 shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-lg ${
                          d.tier === 'Expert'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-gray-600'
                        }`}
                      >
                        {d.score}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          {getTranslation(lang, d.domain) || d.domain}
                        </span>
                        <strong
                          className={`tracking-wide capitalize text-sm ${
                            d.tier === 'Expert'
                              ? 'font-black text-black'
                              : 'font-semibold text-gray-600'
                          }`}
                        >
                          {d.badgeLabel}
                        </strong>
                      </div>
                    </div>

                    <div className="text-xl">{d.tier === 'Expert' ? '🛡️' : '✓'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-10 left-10 right-10 border-t border-gray-300 pt-5 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
          <span>Verified by Awareshield</span>
          <span>Page 1</span>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      {(criticalPage2.length > 0 || suggestedPage1.length > 0) && (
        <div className="pdf-page bg-white text-black w-[1123px] h-[1587px] p-10 font-sans mb-8 shadow-xl print:shadow-none print:mb-0 relative">
          <div className="mb-8 border-b-4 border-black pb-4">
            <h2 className="text-3xl font-black uppercase tracking-widest">Security Recommendations</h2>
          </div>

          <div className="flex flex-col gap-8">
            {criticalPage2.length > 0 && (
              <div className="border border-black bg-black text-white p-6 rounded-2xl">
                <h3 className="text-xl font-black uppercase tracking-widest mb-5 border-b border-white/20 pb-3">
                  Remaining Critical Actions
                </h3>

                <div className="flex flex-col gap-4">
                  {criticalPage2.map((action, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="font-bold text-lg">{i + 6}.</div>
                      <div>
                        <strong className="text-base font-bold">{action.title}</strong>
                        <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestedPage1.length > 0 && (
              <div className="border-2 border-gray-300 bg-white text-black p-6 rounded-2xl">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-gray-300 pb-3 text-gray-700">
                  Suggested To Practice
                </h3>

                <div className="flex flex-col gap-4">
                  {suggestedPage1.map((action, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="font-bold text-gray-400">{i + 1}.</div>
                      <div>
                        <strong className="font-bold text-sm text-gray-800">{action.title}</strong>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-10 left-10 right-10 border-t border-gray-300 pt-5 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
            <span>Verified by Awareshield</span>
            <span>Page 2</span>
          </div>
        </div>
      )}

      {/* ================= PAGE 3 ================= */}
      {suggestedPage2.length > 0 && (
        <div className="pdf-page bg-white text-black w-[1123px] h-[1587px] p-10 font-sans mb-8 shadow-xl print:shadow-none print:mb-0 relative">
          <div className="mb-8 border-b-4 border-black pb-4">
            <h2 className="text-3xl font-black uppercase tracking-widest">Additional Recommendations</h2>
          </div>

          <div className="border-2 border-gray-300 bg-white text-black p-6 rounded-2xl">
            <h3 className="text-lg font-bold uppercase tracking-widest mb-5 border-b border-gray-300 pb-3 text-gray-700">
              More Suggested Practices
            </h3>

            <div className="flex flex-col gap-4">
              {suggestedPage2.map((action, i) => (
                <div key={i} className="flex gap-3">
                  <div className="font-bold text-gray-400">{i + 6}.</div>
                  <div>
                    <strong className="font-bold text-sm text-gray-800">{action.title}</strong>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 border-t border-gray-300 pt-5 flex justify-between text-gray-400 text-xs font-bold uppercase tracking-widest">
            <span>Verified by Awareshield</span>
            <span>Page 3</span>
          </div>
        </div>
      )}
    </div>
  );
}
