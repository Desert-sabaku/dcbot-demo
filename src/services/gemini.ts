import { requireEnv } from "../config/env";

type GeminiGenerateContentResponse = {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
};

const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const apiKey = requireEnv("GEMINI_API_KEY");

export const askGemini = async (question: string): Promise<string> => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const parsedResponse =
        (await response.json()) as GeminiGenerateContentResponse;
    const data = parsedResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!data) {
        throw new Error("Gemini API response does not contain text");
    }

    return data;
};
