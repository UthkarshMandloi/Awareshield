'use client';

import { useState, useMemo } from 'react';
import { Question, UserResponse } from '../types';
import { getTranslation } from '../utils/i18n';

function getRandomQuestions(bank: Question[]): Question[] {
  const selected: Question[] = [];

  // Dynamically extract domains to support translated domain names automatically
  const uniqueDomains = Array.from(new Set(bank.map(q => q.domain)));

  uniqueDomains.forEach(domain => {
    // Filter questions belonging to this domain
    const domainQuestions = bank.filter(q => q.domain === domain);

    // Shuffle the array
    const shuffled = [...domainQuestions].sort(() => 0.5 - Math.random());

    // Take up to 5
    selected.push(...shuffled.slice(0, 5));
  });

  return selected.sort(() => 0.5 - Math.random());
}

interface QuizProps {
  onComplete: (responses: UserResponse[]) => void;
  questionsBank: Question[];
  lang: string;
}

export default function Quiz({ onComplete, questionsBank, lang }: QuizProps) {
  // Compute exactly once on mount so it doesn't shuffle upon every answer click
  const questions = useMemo(() => getRandomQuestions(questionsBank), [questionsBank]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
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
    <div className="min-h-screen w-full bg-black px-4 py-4 md:px-6 md:py-6 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-4xl h-[95vh] md:h-[92vh] bg-[#0c0c0c]/80 backdrop-blur-xl rounded-3xl border border-[#39ff14]/20 shadow-[0_0_50px_rgba(57,255,20,0.1)] relative overflow-hidden">
        
        {/* Subtle structural inner glow */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(255,255,255,0.02)] pointer-events-none z-0"></div>

        <div className="relative z-10 h-full flex flex-col p-5 sm:p-6 md:p-8 lg:p-10">
          
          {/* Progress Bar Header */}
          <div className="mb-6 md:mb-8 shrink-0">
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-3 font-mono tracking-widest uppercase items-center gap-3">
              <span className="text-[#39ff14] drop-shadow-[0_0_5px_#39ff14] bg-[#39ff14]/10 px-3 py-1 rounded-full border border-[#39ff14]/30 truncate max-w-[60%]">
                {getTranslation(lang, currentQuestion.domain) || currentQuestion.domain}
              </span>
              <span className="bg-black/50 px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
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
          <div className="shrink-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 tracking-wide leading-snug drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Scrollable Options Area */}
          <div className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar mb-6 md:mb-8">
            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option, index) => {
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
                    <div className="flex items-start gap-4">
                      {/* Custom Radio Circle */}
                      <div
                        className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'border-[#39ff14]' : 'border-gray-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-[#39ff14] rounded-full shadow-[0_0_8px_#39ff14]"></div>
                        )}
                      </div>

                      <span className="leading-relaxed text-sm sm:text-[15px] md:text-base">
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-between pt-4 md:pt-6 border-t border-white/10 items-center shrink-0 gap-4">
            <button
              onClick={handleSkip}
              className="px-4 sm:px-6 py-3 md:py-4 rounded-full font-bold tracking-[0.1em] uppercase text-[10px] sm:text-xs text-gray-500 hover:text-white transition-all duration-300"
            >
              {getTranslation(lang, 'skip') || 'SKIP AUDIT'}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedWeight === null}
              className={`px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-bold tracking-[0.1em] uppercase text-[10px] sm:text-xs transition-all duration-500 ${
                selectedWeight !== null
                  ? 'bg-[#39ff14] text-black hover:bg-white hover:text-black shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-105'
                  : 'bg-black/40 border border-white/10 text-gray-600 cursor-not-allowed'
              }`}
            >
              {currentIndex === questions.length - 1
                ? getTranslation(lang, 'analyze') || 'ANALYZE'
                : getTranslation(lang, 'next') || 'NEXT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
