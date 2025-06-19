import OpenAI from "openai";
import fs from "fs";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function transcribeAudio(audioFilePath: string): Promise<{ text: string, duration: number }> {
  try {
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return {
      text: transcription.text,
      duration: 0, // Whisper API doesn't return duration, would need to calculate separately
    };
  } catch (error) {
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

export async function extractActionItems(transcript: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that extracts action items from meeting transcripts. 
          Analyze the transcript and identify specific, actionable tasks that were mentioned or assigned.
          Return a JSON object with an array of action items. Each action item should be a clear, concise statement.
          Format: { "actionItems": ["action item 1", "action item 2", ...] }`
        },
        {
          role: "user",
          content: `Please extract action items from this meeting transcript:\n\n${transcript}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"actionItems": []}');
    return result.actionItems || [];
  } catch (error) {
    throw new Error(`Failed to extract action items: ${error.message}`);
  }
}

export async function summarizeMeeting(transcript: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that creates concise meeting summaries. Summarize the key points, decisions, and outcomes from the meeting transcript."
        },
        {
          role: "user",
          content: `Please summarize this meeting transcript:\n\n${transcript}`
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    throw new Error(`Failed to summarize meeting: ${error.message}`);
  }
}
