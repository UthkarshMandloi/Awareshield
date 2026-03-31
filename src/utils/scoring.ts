import { UserResponse } from '../types';

export function calculateScores(responses: UserResponse[]) {
  // 1. Initialize empty scores for the 6 domains
  const domainScores: Record<string, number> = {
    "Password Habits": 0,
    "Device Security": 0,
    "Social Media Safety": 0,
    "Email and Phishing Awareness": 0,
    "Wi-Fi and Network Safety": 0,
    "App and Account Permissions": 0,
  };

  // 2. Add up the weights for each domain
  responses.forEach((response) => {
    if (domainScores[response.domain] !== undefined) {
      domainScores[response.domain] += response.score;
    }
  });

  // 3. Calculate the Overall Score (Average of all 6 domains)
  const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
  const overallScore = Math.round(totalScore / 6);

  // 4. Determine the Badge Tier
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
  };
}