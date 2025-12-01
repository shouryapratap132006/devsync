import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateRoadmapWithGemini({
  skills,
  wantToLearn,
  level,
  goal,
  time,
  extraDetails,
}) {
  const prompt = `
Create a detailed week-by-week learning roadmap.
Current skills: ${skills.join(", ")}
Wants to learn: ${wantToLearn.join(", ")}
Level: ${level}
Goal: ${goal}
Time Available: ${time}
Extra Details: ${extraDetails}

Output strictly valid JSON. The output should be an array of strings, where each string represents one week's plan.
Example format:
[
  "Week 1: Focus on basics...",
  "Week 2: Advanced concepts..."
]
Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON array.
`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown code blocks if the model ignores the instruction
    text = text.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

    let weeks;
    try {
      weeks = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // Fallback to splitting by newline if JSON fails, though less reliable
      weeks = text.split("\n").filter(line => line.trim().length > 0);
    }

    // Ensure it's an array
    if (!Array.isArray(weeks)) {
      weeks = [text];
    }

    return weeks;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    return ["Could not generate roadmap via Gemini"];
  }
}
