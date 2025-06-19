import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBiographySchema, insertPressReleaseSchema, insertVideoSchema, insertMediaFileSchema, insertCustomFontSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'audio/mpeg', 'audio/wav', 'audio/mp3'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Initialize OpenAI - check multiple possible environment variable names
const getOpenAIKey = () => {
  return process.env.OPENAI_API_KEY || 
         process.env.VITE_OPENAI_API_KEY || 
         process.env["OPENAI_API_KEY"] ||
         "";
};

const openai = new OpenAI({
  apiKey: getOpenAIKey()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Current user ID (in real app, this would come from authentication)
  const currentUserId = 1;

  // Debug API key availability
  const apiKey = getOpenAIKey();
  console.log("OpenAI API Key length:", apiKey.length);
  console.log("OpenAI API Key starts with:", apiKey.substring(0, 7));

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(currentUserId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Biography endpoints
  app.get("/api/biographies", async (req, res) => {
    try {
      const biographies = await storage.getBiographies(currentUserId);
      res.json(biographies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch biographies" });
    }
  });

  app.post("/api/biographies", async (req, res) => {
    try {
      const validatedData = insertBiographySchema.parse({
        ...req.body,
        userId: currentUserId
      });

      const apiKey = getOpenAIKey();
      if (!apiKey) {
        return res.status(400).json({ 
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your Replit secrets.",
          details: "Go to Replit Secrets and add your OpenAI API key to enable AI-powered biography generation."
        });
      }

      // Generate biography using OpenAI
      const prompt = `Create a professional and engaging biography for a musical artist with the following information:

Artist Name: ${validatedData.artistName}
Genre: ${validatedData.genre}
Achievements: ${validatedData.achievements || 'Not specified'}
Influences: ${validatedData.influences || 'Not specified'}
Tone: ${validatedData.tone}
Target Audience: ${validatedData.audience}

Please provide both:
1. A short bio (exactly 300 characters or less)
2. A full biography (3 paragraphs, professional and engaging)

Return the response in JSON format with "shortBio" and "fullBio" fields.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      const biography = await storage.createBiography(validatedData);
      
      // Update the biography with generated content
      const updatedBiography = {
        ...biography,
        shortBio: result.shortBio,
        fullBio: result.fullBio
      };

      res.json(updatedBiography);
    } catch (error: any) {
      console.error("Biography generation error:", error);
      if (error?.status === 401) {
        res.status(400).json({ 
          error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY in Replit secrets.",
          details: "Your API key may be invalid or expired. Get a new one from https://platform.openai.com/api-keys"
        });
      } else {
        res.status(500).json({ error: "Failed to generate biography" });
      }
    }
  });

  // Press Release endpoints
  app.get("/api/press-releases", async (req, res) => {
    try {
      const releases = await storage.getPressReleases(currentUserId);
      res.json(releases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch press releases" });
    }
  });

  app.post("/api/press-releases", async (req, res) => {
    try {
      const validatedData = insertPressReleaseSchema.parse({
        ...req.body,
        userId: currentUserId
      });

      const apiKey = getOpenAIKey();
      if (!apiKey) {
        return res.status(400).json({ 
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your Replit secrets.",
          details: "Go to Replit Secrets and add your OpenAI API key to enable AI-powered press release generation."
        });
      }

      // Generate press release using OpenAI
      const prompt = `Create a professional press release for a music release with the following information:

Artist Name: ${validatedData.artistName}
Song Title: ${validatedData.songTitle}
Music Style: ${validatedData.musicStyle || 'Not specified'}
Mood/Vibe: ${validatedData.mood || 'Not specified'}
Release Date: ${validatedData.releaseDate || 'Not specified'}
Collaborators: ${validatedData.collaborators || 'None'}
Main Message/Theme: ${validatedData.themeMessage || 'Not specified'}

Return ONLY a JSON object with exactly these two fields:
- "shortRelease": A brief announcement of exactly 300 characters or less
- "fullRelease": A complete press release with headline and body paragraphs as a single string

Example format:
{
  "shortRelease": "Artist announces new single...",
  "fullRelease": "FOR IMMEDIATE RELEASE\\n\\nArtist Name Releases New Single...\\n\\nFull press release content here..."
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      const pressRelease = await storage.createPressRelease(validatedData);
      
      // Update the press release with generated content
      const updatedPressRelease = {
        ...pressRelease,
        shortRelease: result.shortRelease,
        fullRelease: result.fullRelease
      };

      res.json(updatedPressRelease);
    } catch (error: any) {
      console.error("Press release generation error:", error);
      if (error?.status === 401) {
        res.status(400).json({ 
          error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY in Replit secrets.",
          details: "Your API key may be invalid or expired. Get a new one from https://platform.openai.com/api-keys"
        });
      } else {
        res.status(500).json({ error: "Failed to generate press release" });
      }
    }
  });

  // Media file endpoints
  app.get("/api/media-files", async (req, res) => {
    try {
      const mediaFiles = await storage.getMediaFiles(currentUserId);
      res.json(mediaFiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch media files" });
    }
  });

  app.post("/api/media-files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'audio';
      const fileUrl = `/uploads/${req.file.filename}`;

      const mediaFile = await storage.createMediaFile({
        userId: currentUserId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        type: fileType
      });

      res.json(mediaFile);
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.delete("/api/media-files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const mediaFile = await storage.getMediaFile(id);
      
      if (!mediaFile) {
        return res.status(404).json({ error: "File not found" });
      }

      // Delete physical file
      const filePath = path.join(process.cwd(), 'uploads', mediaFile.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await storage.deleteMediaFile(id);
      res.json({ success: true });
    } catch (error) {
      console.error("File deletion error:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Video endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos(currentUserId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const { artistName, songTitle, imageFileId, audioFileId, duration, quality } = req.body;
      
      if (!artistName || !songTitle || !imageFileId || !audioFileId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // In a real implementation, this would generate an actual video
      // For now, we'll create a placeholder URL
      const videoUrl = `/videos/generated_${Date.now()}.mp4`;

      const video = await storage.createVideo({
        userId: currentUserId,
        artistName,
        songTitle,
        videoUrl,
        imageFileId: parseInt(imageFileId),
        audioFileId: parseInt(audioFileId),
        duration: parseInt(duration) || 15,
        quality: quality || "720p"
      });

      res.json(video);
    } catch (error) {
      console.error("Video creation error:", error);
      res.status(500).json({ error: "Failed to create video" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects(currentUserId);
      res.json(projects.slice(0, 5)); // Return only the 5 most recent
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { name, type, data } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ error: "Name and type are required" });
      }

      const project = await storage.createProject({
        userId: currentUserId,
        name,
        type,
        content: JSON.stringify(data || {})
      });

      res.json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (project.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Project deletion error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Image generation endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, size = '1024x1024' } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = getOpenAIKey();
      if (!apiKey) {
        return res.status(400).json({ 
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your Replit secrets.",
          details: "Go to Replit Secrets and add your OpenAI API key to enable AI-powered image generation."
        });
      }

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: size,
          quality: 'standard'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate image');
      }

      const result = await response.json();
      res.json({ imageUrl: result.data[0].url });
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate image", 
        details: error.message || "Unknown error occurred"
      });
    }
  });

  // Image proxy endpoint to avoid CORS issues
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const buffer = await response.arrayBuffer();

      res.set('Content-Type', contentType);
      res.set('Access-Control-Allow-Origin', '*');
      res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.error("Image proxy error:", error);
      res.status(500).json({ 
        error: "Failed to proxy image", 
        details: error.message || "Unknown error occurred"
      });
    }
  });

  // Custom Fonts routes
  app.get("/api/custom-fonts", async (req, res) => {
    try {
      // Get all fonts regardless of user for shared library
      const fonts = await storage.getAllCustomFonts();
      res.json(fonts);
    } catch (error) {
      console.error("Failed to fetch custom fonts:", error);
      res.status(500).json({ error: "Failed to fetch custom fonts" });
    }
  });

  app.post("/api/custom-fonts", async (req, res) => {
    try {
      const validatedData = insertCustomFontSchema.parse({
        ...req.body,
        userId: currentUserId
      });

      const customFont = await storage.createCustomFont(validatedData);
      res.json(customFont);
    } catch (error) {
      console.error("Custom font creation error:", error);
      res.status(500).json({ error: "Failed to create custom font" });
    }
  });

  app.delete("/api/custom-fonts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const font = await storage.getCustomFont(id);
      
      if (!font) {
        return res.status(404).json({ error: "Font not found" });
      }

      if (font.userId !== currentUserId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteCustomFont(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Font deletion error:", error);
      res.status(500).json({ error: "Failed to delete font" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}
