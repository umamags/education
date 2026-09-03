import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { createPrompt } from './prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getChildDevelopmentData(age) {
  if (!age) {
    console.error('Error: Age parameter is required');
    console.error('Usage: node src/getChildDevelopment.js <age>');
    console.error('Example: node src/getChildDevelopment.js 3');
    process.exit(1);
  }

  // Validate age
  const ageNum = parseFloat(age);
  if (isNaN(ageNum) || ageNum < 0.5 || ageNum > 10) {
    console.error(`Error: Age must be between 0.5 and 10. Got: ${age}`);
    process.exit(1);
  }

  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  try {
    console.log(`Fetching child development data for age ${ageNum}...`);

    const prompt = createPrompt(ageNum);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the response text
    const responseText = response.choices[0].message.content;

    // Parse the JSON response
    let developmentData;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = responseText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      // Find the first { and last }
      const startIdx = cleanedResponse.indexOf('{');
      const endIdx = cleanedResponse.lastIndexOf('}');

      if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
        throw new Error('No valid JSON object found in response');
      }

      const jsonStr = cleanedResponse.substring(startIdx, endIdx + 1);
      developmentData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError.message);
      console.error('First 500 chars of raw response:', responseText.substring(0, 500));
      process.exit(1);
    }

    // Ensure data folder exists
    const dataFolder = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder, { recursive: true });
    }

    // Save to file
    const fileName = `age_${ageNum.toFixed(1)}.json`;
    const filePath = path.join(dataFolder, fileName);

    fs.writeFileSync(filePath, JSON.stringify(developmentData, null, 2), 'utf-8');

    console.log(`✓ Successfully saved data to ${filePath}`);
    console.log(`\nDevelopment areas tracked:`);
    if (developmentData.dimensions && Array.isArray(developmentData.dimensions)) {
      developmentData.dimensions.forEach((dim) => {
        console.log(`  - ${dim.title}`);
      });
    }
  } catch (error) {
    console.error('Error fetching development data:', error.message);
    process.exit(1);
  }
}

// Get age from command line arguments
const age = process.argv[2];
getChildDevelopmentData(age);
