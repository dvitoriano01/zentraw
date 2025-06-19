import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // For client-side usage in development
});

export async function generateBiography(params: {
  artistName: string;
  genre: string;
  achievements: string;
  influences: string;
  tone: string;
  audience: string;
}): Promise<{ shortBio: string; fullBio: string }> {
  const prompt = `Create a professional and engaging biography for a musical artist with the following information:

Artist Name: ${params.artistName}
Genre: ${params.genre}
Achievements: ${params.achievements || 'Not specified'}
Influences: ${params.influences || 'Not specified'}
Tone: ${params.tone}
Target Audience: ${params.audience}

Please provide both:
1. A short bio (exactly 300 characters or less)
2. A full biography (3 paragraphs, professional and engaging)

Return the response in JSON format with "shortBio" and "fullBio" fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      shortBio: result.shortBio || "",
      fullBio: result.fullBio || ""
    };
  } catch (error) {
    console.error("Error generating biography:", error);
    throw new Error("Failed to generate biography");
  }
}

export async function generatePressRelease(params: {
  artistName: string;
  songTitle: string;
  musicStyle: string;
  mood: string;
  releaseDate: string;
  collaborators: string;
  themeMessage: string;
}): Promise<{ shortRelease: string; fullRelease: string }> {
  const prompt = `Create a professional press release for a music release with the following information:

Artist Name: ${params.artistName}
Song Title: ${params.songTitle}
Music Style: ${params.musicStyle || 'Not specified'}
Mood/Vibe: ${params.mood || 'Not specified'}
Release Date: ${params.releaseDate || 'Not specified'}
Collaborators: ${params.collaborators || 'None'}
Main Message/Theme: ${params.themeMessage || 'Not specified'}

Please provide both:
1. A short release announcement (exactly 300 characters or less)
2. A full press release (professional format with headline, multiple paragraphs, quote from artist)

Return the response in JSON format with "shortRelease" and "fullRelease" fields.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      shortRelease: result.shortRelease || "",
      fullRelease: result.fullRelease || ""
    };
  } catch (error) {
    console.error("Error generating press release:", error);
    throw new Error("Failed to generate press release");
  }
}
