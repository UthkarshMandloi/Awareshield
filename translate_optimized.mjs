import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_LANGS = [
  { name: 'asami', code: 'as' },
  { name: 'bangoli', code: 'bn' },
  { name: 'odiya', code: 'or' }
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'questions.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Loaded ${questions.length} questions. Applying OPTIMIZED translation mechanism with RETRIES...`);

  for (const lang of TARGET_LANGS) {
    console.log(`\n=======================`);
    console.log(`Translating to ${lang.name} (${lang.code})...`);

    const outPath = path.join(__dirname, 'public', 'data', `questions_${lang.code}.json`);
    
    const allStringsToTranslate = [];
    questions.forEach(q => {
      // EXCLUDE q.domain so it remains an English constant
      allStringsToTranslate.push(q.text, q.options[0].text, q.options[1].text, q.options[2].text, q.recommendation.title, q.recommendation.description);
    });

    const translatedStrings = [];
    const CHUNK_SIZE = 30; // Safer chunk size 

    try {
      for (let i = 0; i < allStringsToTranslate.length; i += CHUNK_SIZE) {
        console.log(`[${lang.name}] Processing batch ${i} to ${Math.min(i + CHUNK_SIZE, allStringsToTranslate.length,)} / ${allStringsToTranslate.length}...`);
        const chunk = allStringsToTranslate.slice(i, i + CHUNK_SIZE);

        let results = null;
        let retries = 0;

        while (!results && retries < 10) {
          try {
            results = await translate(chunk, { to: lang.code });
          } catch (e) {
            retries++;
            console.error(`[RATE LIMIT] API Failed. Retrying in ${retries * 5} seconds...`);
            await sleep(retries * 5000);
          }
        }

        if (!results) {
          console.error(`[FATAL] Exhausted 10 retries for chunk ${i}. Falling back to English.`);
          results = chunk.map(t => ({ text: t }));
        }

        translatedStrings.push(...results.map(r => r.text));
        
        // Base sleep between successful API calls
        await sleep(4000);
      }

      const translatedQuestions = [];
      let strIdx = 0;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        translatedQuestions.push({
          id: q.id,
          domain: q.domain, // KEEP THE HARDCODED ENGLISH SO FILTERING WORKS PERFECTLY
          text: translatedStrings[strIdx++] || q.text,
          options: [
            { text: translatedStrings[strIdx++] || q.options[0].text, weight: q.options[0].weight },
            { text: translatedStrings[strIdx++] || q.options[1].text, weight: q.options[1].weight },
            { text: translatedStrings[strIdx++] || q.options[2].text, weight: q.options[2].weight }
          ],
          recommendation: {
            title: translatedStrings[strIdx++] || q.recommendation.title,
            description: translatedStrings[strIdx++] || q.recommendation.description,
            impact: q.recommendation.impact,
            ease: q.recommendation.ease
          }
        });
      }

      fs.writeFileSync(outPath, JSON.stringify(translatedQuestions, null, 2));
      console.log(`Finished writing ${outPath}!`);

      await sleep(10000); // Breathe between full languages

    } catch (err) {
      console.error(`CRITICAL ERROR translating ${lang.name}: `, err);
    }
  }

  console.log(`\nALL TRANSLATIONS RE-GENERATED SAFELY!`);
}

run();
