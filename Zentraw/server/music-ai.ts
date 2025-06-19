import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateBioAndRelease(data: {
  artistName: string;
  musicalStyle: string;
  mood?: string;
  targetAudience?: string;
  tone?: string;
  mainTheme?: string;
  collaborations?: string[];
}): Promise<{ shortBio: string; longBio: string; pressRelease: string }> {
  try {
    const prompt = `
Create a professional bio and press release for the music artist with these details:
- Artist Name: ${data.artistName}
- Musical Style: ${data.musicalStyle}
- Mood: ${data.mood || 'Not specified'}
- Target Audience: ${data.targetAudience || 'General music lovers'}
- Tone: ${data.tone || 'Professional'}
- Main Theme: ${data.mainTheme || 'Music and creativity'}
- Collaborations: ${data.collaborations?.join(', ') || 'None mentioned'}

Please respond with JSON containing:
1. shortBio: A concise 2-3 sentence artist biography (perfect for social media)
2. longBio: A detailed 4-6 paragraph artist biography
3. pressRelease: A complete press release suitable for media outlets

Format: { "shortBio": "...", "longBio": "...", "pressRelease": "..." }
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional music industry copywriter specializing in artist bios and press releases. Create compelling, authentic content that captures the artist's essence and appeals to their target audience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      shortBio: result.shortBio || "",
      longBio: result.longBio || "",
      pressRelease: result.pressRelease || ""
    };
  } catch (error) {
    throw new Error(`Failed to generate bio and release: ${error.message}`);
  }
}

export async function generateCoverArt(prompt: string, style: string): Promise<{ imageUrl: string }> {
  try {
    const enhancedPrompt = `${prompt}, ${style} style, high quality album cover art, professional music artwork, 2048x2048 resolution`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const temporaryUrl = response.data[0].url || "";
    console.log("Generated image URL:", temporaryUrl);
    
    // For now, return the temporary URL directly since local saving isn't working
    // TODO: Implement proper image storage solution
    return { imageUrl: temporaryUrl };
  } catch (error) {
    throw new Error(`Failed to generate cover art: ${error.message}`);
  }
}

export async function generateSocialCaption(contentType: string, artistName: string, releaseInfo?: string): Promise<{ caption: string }> {
  try {
    const prompt = `Create an engaging social media caption for ${contentType} by ${artistName}. ${releaseInfo ? `Release info: ${releaseInfo}` : ''} Make it catchy, authentic, and suitable for Instagram/TikTok.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media expert for music artists. Create engaging, authentic captions that drive engagement and reflect the artist's personality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return { caption: response.choices[0].message.content || "" };
  } catch (error) {
    throw new Error(`Failed to generate social caption: ${error.message}`);
  }
}