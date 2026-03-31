import { Question } from '../types';

export async function loadQuestions(lang: string): Promise<Question[]> {
  const isEnglish = !lang || lang === 'en';
  const url = isEnglish ? '/data/questions.json' : `/data/questions_${lang}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Could not load questions for language ${lang}, falling back to English.`);
      const fallbackRes = await fetch('/data/questions.json');
      return await fallbackRes.json();
    }
    return await res.json();
  } catch (error) {
    console.error("Error communicating with data source:", error);
    // Hard fallback just in case
    const fallbackRes = await fetch('/data/questions.json');
    return await fallbackRes.json();
  }
}
