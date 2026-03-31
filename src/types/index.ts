export interface Option {
  text: string;
  weight: number;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: number;
  ease: number;
}

export interface Question {
  id: string;
  domain: string;
  text: string;
  options: Option[];
  recommendation: Recommendation;
}

// This will store the user's answers as they take the quiz
export interface UserResponse {
  questionId: string;
  domain: string;
  score: number;
}