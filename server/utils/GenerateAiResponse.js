const axios = require('axios');
const { OPENROUTER_API_KEY } = process.env;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
let franc, ISO6391;

const initializeImports = async () => {
  const francModule = await import('franc');
  const iso639Module = await import('iso-639-1');
  franc = francModule.franc;
  ISO6391 = iso639Module.default;
};

initializeImports().catch(console.error);

async function generateAIResponse(prompt) {
  try {
    if (!franc || !ISO6391) {
      await initializeImports();
    }

    const langCode = franc(prompt, { minLength: 3 });
    const language = ISO6391.getName(langCode) ;

    const systemPrompt = [
      `Respond in ${language} without any introductory phrases.`,
      "You are an electrical engineering expert. Only provide:",
      "1. Direct answers to electrical questions",
      "2. Technical specifications when asked",
      "3. Safety recommendations",
      "Avoid:",
      "- Explanations about being an AI",
      "- Internal thinking processes",
      "- Non-electrical topics",
      "Format: Clear, concise technical answers without markdown or additional thoughts"
    ].join(' ');

    console.log(language)

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawResponse = response.data.choices[0].message.content;
    return rawResponse.replace(/\(AI[\s\S]*?\)/g, '').trim();
  } catch (error) {
    console.error("AI Response Error:", error);
    return "I'm experiencing technical difficulties. Please try again later.";
  }
}

module.exports = generateAIResponse;
