import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_LANGS = [
  { name: 'hindi', code: 'hi' },
  { name: 'tamil', code: 'ta' },
  { name: 'telugu', code: 'te' },
  { name: 'marathi', code: 'mr' },
  { name: 'gujrati', code: 'gu' },
  { name: 'asami', code: 'as' },
  { name: 'bangoli', code: 'bn' },
  { name: 'odiya', code: 'or' },
  { name: 'manipuri', code: 'mni-Mtei' } // Manipuri (Meitei Mayek) usually has this code if supported, or mni.
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'questions.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const questions = JSON.parse(rawData);

  console.log(`Loaded ${questions.length} questions. Applying translation for ${TARGET_LANGS.length} languages...`);

  for (const lang of TARGET_LANGS) {
    console.log(`\n=======================`);
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    const translatedQuestions = [];

    const outPath = path.join(__dirname, 'public', 'data', `questions_${lang.code}.json`);
    
    // If it already exists, skip to save time in case of crash
    if (fs.existsSync(outPath)) {
      console.log(`Skipping ${lang.name}, file already exists.`);
      continue;
    }

    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        console.log(`[${lang.name}] Translating Q${i+1}/${questions.length}...`);

        // Batch text to translate for this specific question to reduce total HTTP requests
        const batch = [
          q.domain,
          q.text,
          ...q.options.map(o => o.text),
          q.recommendation.title,
          q.recommendation.description
        ];

        let results;
        try {
            results = await translate(batch, { to: lang.code, forceBatch: false });
        } catch (e) {
            console.error(`Error translating batch with code ${lang.code}, returning to original English on failure: `, e.message);
            // Fallback: just copy the original English text if the API fails for this specific language code
            results = batch.map(t => ({ text: t })); 
        }

        const trans = results.map(r => r.text);

        translatedQuestions.push({
          id: q.id,
          // If translation failed, `trans[0]` will be the original English text.
          domain: trans[0],
          text: trans[1],
          options: [
            { text: trans[2], weight: q.options[0].weight },
            { text: trans[3], weight: q.options[1].weight },
            { text: trans[4], weight: q.options[2].weight }
          ],
          recommendation: {
            title: trans[5],
            description: trans[6],
            impact: q.recommendation.impact,
            ease: q.recommendation.ease
          }
        });

      }

      fs.writeFileSync(outPath, JSON.stringify(translatedQuestions, null, 2));
      console.log(`Finished writing ${outPath}!`);

    } catch (err) {
      console.error(`CRITICAL ERROR translating ${lang.name}: `, err);
    }
  }

  console.log(`\nALL TRANSLATIONS EXPERIMENTS COMPLETED!`);
}

run();
