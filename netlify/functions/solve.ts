import { GoogleGenAI, Type } from "@google/genai";

let _aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!_aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY environment variable is not configured yet. Please configure it in the Netlify environment variables."
      );
    }
    _aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return _aiClient;
}

export const handler = async (event: any, context: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successful preflight" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { inputType, image, typedInput, subject, classLevel, language } = body;

    let ai;
    try {
      ai = getGeminiClient();
    } catch (credentialError: any) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: "Unconfigured Secrets",
          message: credentialError.message,
        }),
      };
    }

    if (inputType === "typed" && !typedInput) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing parameter: typedInput is required for typed inputType" }),
      };
    }
    if (inputType === "image" && !image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing parameter: image (base64) is required for image inputType" }),
      };
    }

    const isBengali = language === "Bangla" || language === "Bengali";
    const sysInstruction = `You are the high-speed backend core engine of the mobile/desktop app "AI math scanner step solver", powered by Gemini.
Your job is to process mathematical or scientific problems (from images, OCR text, or manual inputs) and return an ultra-fast, accurate, line-by-line solution.

Strict Rules for Globalization & Output:
1. Academic Context: Adapt complexity, notation, and depth based on the provided Class Level (${classLevel}) and Subject (${subject}).
2. Language compliance:
   - Since the chosen language is "${language}", you MUST generate the entire output (including step titles, descriptions, final answers, explanation, question phrasing, and MCQ elements) in "${language}".
   - If "${language}" is selected as Bangla/Bengali: The entire response MUST be in Bengali (বাংলা). All explanations, step titles, identified problems, final results, short answer, and MCQ elements MUST use Bengali language, grammar, and Bengali digits (convert 1,2,3,4,5,6,7,8,9,0 to ১,২,৩,৪,৫,৬,৭,৮,৯,০ everywhere). Every single digit in explanations, equations, step numbers, titles, options, and quick answers must strictly use Bengali digits/characters (১, ২, ৩, etc. instead of 1, 2, 3). NO English digits are allowed under any circumstance, even inside LaTeX equations if feasible.
   - If ANY other global language matches "${language}" (e.g. Spanish, Arabic, Hindi, French, Russian, German, Chinese, Japanese, etc.): Translate the entire text, explanations, titles, options, and answers to that chosen language. If the native script or culture uses custom numeral systems (e.g., Arabic/Hindi numerals), you can use them, but ensure standard mathematical readability for high school/college settings.
3. Formatting: All mathematical steps, formulas, and variables must be structured in LaTeX standard (wrap inside standard inline $ or block $$ delimiters). Under no conditions use raw plain text characters or basic symbols for variable paths (e.g., use $x^2 + 5x + 6 = 0$ instead of x^2+5x+6=0).
4. Explanations: For every single mathematical step or line modification, write a mandatory brief explanation line immediately following it explaining the rule or substitution used. Formulate explanations explicitly in "${language}".
5. MCQ Generation: Restate the solved problem as an interactive Multiple Choice Question (MCQ) containing exactly 4 distinct options (A, B, C, D) and describe which identifier is correct and why.
6. Short Answer: Formulate a clean, concise single-line short representation of the final answer (e.g. 'x = 3' or '১০ মিটার' or '50 \\text{ kg}').`;

    let contentsParts: any[] = [];
    let promptString = "";

    if (inputType === "image") {
      // Decode base64 image data URL if present
      let rawBase64 = image;
      let mimeType = "image/png";
      
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        rawBase64 = matches[2];
      }

      contentsParts.push({
        inlineData: {
          data: rawBase64,
          mimeType,
        },
      });

      promptString = `Input Type: [Image Scan / Gallery Upload]
Target Subject: ${subject}
Target Class Level: ${classLevel}
Output Language: ${language}

Task: Analyze the attached image containing a math or science problem.
Extract the equation or problem correctly, solve it completely step-by-step with LaTeX equations, and write brief human explanations for every single step in ${language}.
${isBengali ? "CRITICAL: The user has selected Bangla/Bengali as the output language. Ensure the entire response (including explanations, steps, labels, text, formulas, equations, numbers, options, and symbols like 1,2,3 converted to ১,২,৩) is in Bengali language and uses Bengali digits. Strictly match the response schema in Bengali." : `Generate your response in ${language} strictly matching the response schema.`}`;
    } else {
      promptString = `Input Type: [Manually Typed Text Input]
User Text Expression: "${typedInput}"
Target Subject: ${subject}
Target Class Level: ${classLevel}
Output Language: ${language}

Task: Solve this manual input mathematical string or problem.
Return the complete solution including step-by-step mathematical proofs with LaTeX equations, and write brief human explanations for every single step in ${language}.
${isBengali ? "CRITICAL: The user has selected Bangla/Bengali as the output language. Ensure the entire response (including explanations, steps, labels, text, formulas, equations, numbers, options, and symbols like 1,2,3 converted to ১,২,৩) is in Bengali language and uses Bengali digits. Strictly match the response schema in Bengali." : `Generate your response in ${language} strictly matching the response schema.`}`;
    }

    contentsParts.push({ text: promptString });

    // Explicitly enforce 'gemini-2.5-flash' for camera/image inputs
    const selectedModel = inputType === "image" ? "gemini-2.5-flash" : "gemini-3.5-flash";

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts: contentsParts },
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.1, // low temperature for precise mathematical calculation
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identifiedProblem: {
              type: Type.STRING,
              description: "The extracted math/science question re-rendered cleanly in clean inline or block LaTeX."
            },
            quickAnswer: {
              type: Type.STRING,
              description: "The final absolute answer value or expression, packaged cleanly inside LaTeX (e.g. 'x = \\pm 3' or 'F = 15 \\text{ N}')."
            },
            shortAnswer: {
              type: Type.STRING,
              description: "A clean, concise short representation of the final answer containing only the final value or equation (e.g., 'x = 3' or '১০০ মিটার')."
            },
            mcqQuestion: {
              type: Type.STRING,
              description: "The math/science problem formulated as an interactive multiple-choice question in the output language."
            },
            mcqOptions: {
              type: Type.ARRAY,
              description: "Exactly 4 options, each containing the option prefix and description (e.g., 'A) 5', 'B) 10', etc. using localized numerals and translations in the output language).",
              items: { type: Type.STRING }
            },
            mcqCorrectAnswer: {
              type: Type.STRING,
              description: "The correct option label, e.g. 'A', 'B', 'C', or 'D'."
            },
            mcqExplanation: {
              type: Type.STRING,
              description: "Brief description of why this option is correct."
            },
            steps: {
              type: Type.ARRAY,
              description: "List of step-by-step solutions showing math development and human explanations lines.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "A short, descriptive, action-oriented title for this step (e.g. 'Substitute values', 'Factor the quadratic')."
                  },
                  equation: {
                    type: Type.STRING,
                    description: "The mathematical formula, line state, or equation rewritten in clean LaTeX format for this stage."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Brief, direct explanation of the step in the requested user language (e.g., 'Bengali', 'Spanish', 'English', etc.)."
                  }
                },
                required: ["title", "equation", "explanation"]
              }
            }
          },
          required: [
            "identifiedProblem",
            "quickAnswer",
            "shortAnswer",
            "mcqQuestion",
            "mcqOptions",
            "mcqCorrectAnswer",
            "mcqExplanation",
            "steps"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content generated by Gemini.");
    }

    const solutionData = JSON.parse(text);

    // Build standard high-fidelity Markdown following requested template
    let markdownTemplate = `### 📝 Identified Problem\n$${solutionData.identifiedProblem}$\n\n`;
    markdownTemplate += `### 🚀 Quick Answer\n**$$ ${solutionData.quickAnswer} $$**\n\n`;
    markdownTemplate += `### 🔍 Step-by-Step Explanation\n`;
    
    solutionData.steps.forEach((step: any, idx: number) => {
      markdownTemplate += `${idx + 1}. **Step ${idx + 1}: ${step.title}**\n   $$ ${step.equation} $$\n   *Explanation:* ${step.explanation}\n\n`;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        identifiedProblem: solutionData.identifiedProblem,
        quickAnswer: solutionData.quickAnswer,
        shortAnswer: solutionData.shortAnswer,
        mcqQuestion: solutionData.mcqQuestion,
        mcqOptions: solutionData.mcqOptions,
        mcqCorrectAnswer: solutionData.mcqCorrectAnswer,
        mcqExplanation: solutionData.mcqExplanation,
        steps: solutionData.steps.map((s: any, idx: number) => ({
          id: idx + 1,
          title: s.title,
          equation: s.equation,
          explanation: s.explanation,
        })),
        rawMarkdown: markdownTemplate,
      }),
    };

  } catch (error: any) {
    console.error("Gemini solving error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Solving Failed",
        message: error.message || "An error occurred while solving the problem.",
      }),
    };
  }
};
