'use client';

import { useState, useMemo } from 'react';

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

export function getTranslation(lang: string, key: string): string {
  const translations: Record<string, Record<string, string>> = {
    en: { skip: 'SKIP AUDIT', next: 'NEXT', analyze: 'ANALYZE' }
  };
  return translations[lang]?.[key] || key;
}

function getRandomQuestions(bank: Question[]): Question[] {
  if (!bank || !Array.isArray(bank) || bank.length === 0) return [];

  const selected: Question[] = [];
  const uniqueDomains = Array.from(new Set(bank.map(q => q.domain)));

  uniqueDomains.forEach(domain => {
    const domainQuestions = bank.filter(q => q.domain === domain);
    const shuffled = [...domainQuestions].sort(() => 0.5 - Math.random());
    selected.push(...shuffled.slice(0, 5));
  });

  return selected.sort(() => 0.5 - Math.random());
}

interface QuizProps {
  onComplete: (responses: UserResponse[]) => void;
  questionsBank: Question[];
  lang?: string;
}

export default function Quiz({ onComplete, questionsBank = [], lang = 'en' }: QuizProps) {
  const questions = useMemo(() => getRandomQuestions(questionsBank), [questionsBank]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];

  if (!questions || questions.length === 0 || !currentQuestion) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="w-full max-w-3xl mx-auto p-10 bg-[#0c0c0c]/80 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center min-h-[300px]">
          <p className="text-[#39ff14] animate-pulse tracking-widest text-sm font-mono uppercase">
            Initializing Audit...
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (weight: number) => {
    setSelectedWeight(weight);
  };

  const handleNext = () => {
    if (selectedWeight === null) return;

    const newResponse: UserResponse = {
      questionId: currentQuestion.id,
      domain: currentQuestion.domain,
      score: selectedWeight,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedWeight(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updatedResponses);
    }
  };

  const handleSkip = () => {
    const remainingResponses = questions.slice(currentIndex).map(q => ({
      questionId: q.id,
      domain: q.domain,
      score: 0
    }));

    const finalResponses = [...responses, ...remainingResponses];
    onComplete(finalResponses);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-3xl h-[95vh] p-6 md:p-8 lg:p-10 bg-[#0c0c0c]/80 backdrop-blur-xl rounded-3xl border border-[#39ff14]/20 shadow-[0_0_50px_rgba(57,255,20,0.1)] relative overflow-hidden group flex flex-col">
        
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(255,255,255,0.02)] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* Progress */}
          <div className="mb-5 shrink-0">
            <div className="flex justify-between text-xs text-gray-400 mb-3 font-mono tracking-widest uppercase items-center">
              <span className="text-[#39ff14] drop-shadow-[0_0_5px_#39ff14] bg-[#39ff14]/10 px-3 py-1 rounded-full border border-[#39ff14]/30">
                {getTranslation(lang, currentQuestion.domain) || currentQuestion.domain}
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full border border-white/10">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="w-full bg-[#111] rounded-full h-2 border border-white/5 overflow-hidden">
              <div
                className="bg-[#39ff14] h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_#39ff14]"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-5 tracking-wide leading-snug drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] shrink-0">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 flex-1 overflow-hidden">
            {currentQuestion.options?.slice(0, 4).map((option, index) => {
              const isSelected = selectedWeight === option.weight;
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option.weight)}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 font-medium ${
                    isSelected
                      ? 'bg-[#39ff14]/15 border-[#39ff14] text-[#39ff14] shadow-[0_0_25px_rgba(57,255,20,0.25)] scale-[1.01]'
                      : 'bg-[#111]/80 border-white/10 text-gray-300 hover:border-[#39ff14]/50 hover:bg-[#39ff14]/5 hover:shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-[#39ff14]' : 'border-gray-600'}`}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_#39ff14]"></div>
                      )}
                    </div>
                    <span className="leading-relaxed text-[14px] md:text-[15px]">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-5 border-t border-white/10 items-center shrink-0 mt-5">
            <button
              onClick={handleSkip}
              className="px-4 md:px-6 py-3 md:py-4 rounded-full font-bold tracking-[0.1em] uppercase text-[10px] text-gray-500 hover:text-white transition-all duration-300"
            >
              {getTranslation(lang, 'skip') || 'SKIP AUDIT'}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedWeight === null}
              className={`px-8 md:px-10 py-3 md:py-4 rounded-full font-bold tracking-[0.1em] uppercase text-[10px] md:text-xs transition-all duration-500 ${
                selectedWeight !== null
                  ? 'bg-[#39ff14] text-black hover:bg-white hover:text-black shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-105'
                  : 'bg-black/40 border border-white/10 text-gray-600 cursor-not-allowed'
              }`}
            >
              {currentIndex === questions.length - 1
                ? getTranslation(lang, 'analyze')
                : getTranslation(lang, 'next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
