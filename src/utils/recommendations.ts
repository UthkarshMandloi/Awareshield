import { UserResponse, Question, Recommendation } from '../types';

export function getTopRecommendations(responses: UserResponse[], questionsBank: Question[]): Recommendation[] {
  // 1. Find all questions where the user didn't get a perfect score (< 20)
  const weakResponses = responses.filter(r => r.score < 20);

  // 2. Map those weak responses to the embedded recommendations in our JSON
  const actionableItems = weakResponses
    .map(r => {
      const parentQuestion = questionsBank.find(q => q.id === r.questionId);
      return parentQuestion?.recommendation;
    })
    .filter((rec): rec is Recommendation => rec !== undefined);

  // 3. Sort them by the formula: (Impact + Ease) descending
  actionableItems.sort((a, b) => {
    const scoreA = a.impact + a.ease;
    const scoreB = b.impact + b.ease;
    return scoreB - scoreA;
  });

  // 4. Return only the Top 5
  return actionableItems.slice(0, 5);
}

// Strictly for the PDF Report Layout
export function getGroupedPdfRecommendations(responses: UserResponse[], questionsBank: Question[]) {
  const critical: Recommendation[] = [];
  const suggested: Recommendation[] = [];

  responses.forEach(r => {
    // Perfect score (20), do nothing
    if (r.score >= 20) return;

    const parentQuestion = questionsBank.find(q => q.id === r.questionId);
    if (!parentQuestion || !parentQuestion.recommendation) return;

    // Worst score means Critical Attention Needed
    if (r.score === 0) {
      critical.push(parentQuestion.recommendation);
    } 
    // Mediocre scores mean Suggested to Practice
    else if (r.score > 0 && r.score < 20) {
      suggested.push(parentQuestion.recommendation);
    }
  });

  return { critical, suggested };
}