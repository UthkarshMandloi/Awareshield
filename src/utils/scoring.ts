import { UserResponse } from '../types';

export function calculateScores(responses: UserResponse[]) {
  // 1. Initialize empty scores dynamically for whatever domains got translated
  const domainScores: Record<string, number> = {};
  const uniqueDomains = Array.from(new Set(responses.map(r => r.domain)));
  
  uniqueDomains.forEach(domain => {
    domainScores[domain] = 0;
  });

  // 2. Add up the weights for each domain
  responses.forEach((response) => {
    if (domainScores[response.domain] !== undefined) {
      domainScores[response.domain] += response.score;
    }
  });

  // 3. Calculate the Overall Score (Average of all domains)
  const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
  const domainCount = Object.keys(domainScores).length || 1; // Prevent division by 0
  const overallScore = Math.round(totalScore / domainCount);

  // 4. Determine the Mastered Domain (Highest Scoring Field)
  let masteredDomain = '';
  let maxScore = -1;
  Object.entries(domainScores).forEach(([domain, score]) => {
    if (score > maxScore) {
      maxScore = score;
      masteredDomain = domain;
    }
  });

  // 5. Determine the Badge Tier
  let badgeTier = "Needs Improvement";
  if (overallScore >= 80) {
    badgeTier = "Good";
  } else if (overallScore >= 40) {
    badgeTier = "Average";
  }

  return {
    domainScores, // Ready to be plugged straight into Chart.js!
    overallScore, // Ready for the big number on the dashboard
    badgeTier,    // Ready for the Canvas image generator
    masteredDomain, // Highest scoring domain
  };
}