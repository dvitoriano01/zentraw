import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertArtistProfileSchema, 
  insertGeneratedContentSchema, 
  insertChartEntrySchema,
  insertScheduledPostSchema 
} from "@shared/schema";
import { generateBioAndRelease, generateCoverArt, generateSocialCaption } from "./music-ai";
import multer from "multer";
import path from "path";
import fs from "fs";

const audioUpload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/ogg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

const imageUpload = multer({
  dest: 'uploads/images/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Ensure uploads directories exist
  const uploadsDir = path.join(process.cwd(), "uploads");
  const imagesDir = path.join(uploadsDir, "images");
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Image upload endpoint
  app.post("/api/upload", imageUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const title = req.body.title || `Uploaded ${file.originalname}`;
      const type = req.body.type || 'upload';

      // Read file and convert to base64 for permanent storage
      const fileBuffer = fs.readFileSync(file.path);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = file.mimetype;
      const imageData = `data:${mimeType};base64,${base64Data}`;

      // Create content record
      const contentData = {
        userId: 1, // Default user for testing
        type: type as any,
        title: title,
        fileData: imageData,
        fileType: mimeType,
        fileSize: file.size,
        status: 'completed' as any
      };

      const content = await storage.createGeneratedContent(contentData);

      // Clean up temporary file
      fs.unlinkSync(file.path);

      res.json({
        id: content.id,
        title: content.title,
        imageUrl: `/api/image/${content.id}`,
        type: content.type,
        status: content.status
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Serve images by ID from database
  app.get("/api/image/:id", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.getGeneratedContentById(contentId);
      
      if (!content || !content.fileData) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Extract base64 data and mime type
      const matches = content.fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ message: "Invalid image data" });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const imageBuffer = Buffer.from(base64Data, 'base64');

      res.set({
        'Content-Type': mimeType,
        'Content-Length': imageBuffer.length,
        'Cache-Control': 'public, max-age=31536000'
      });

      res.send(imageBuffer);
    } catch (error) {
      console.error('Image serve error:', error);
      res.status(500).json({ message: "Failed to serve image" });
    }
  });

  // Serve uploaded images (legacy)
  app.get("/api/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), "uploads", "images", filename);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  });

  // Get artist profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getArtistProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Artist profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist profile" });
    }
  });

  // Create or update artist profile and generate bio/release
  app.post("/api/profile", async (req, res) => {
    try {
      // Transform collaborations from string to array if needed
      const requestData = { ...req.body };
      if (typeof requestData.collaborations === 'string') {
        requestData.collaborations = requestData.collaborations.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      const profileData = insertArtistProfileSchema.parse(requestData);
      
      // Check if profile exists
      const existingProfile = await storage.getArtistProfile(profileData.userId);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateArtistProfile(profileData.userId, profileData);
      } else {
        profile = await storage.createArtistProfile(profileData);
      }

      if (!profile) {
        return res.status(400).json({ message: "Failed to create/update profile" });
      }

      // Generate bio and press release using AI
      try {
        const generatedContent = await generateBioAndRelease({
          artistName: profileData.artistName,
          musicalStyle: profileData.musicalStyle || "",
          mood: profileData.mood || undefined,
          targetAudience: profileData.targetAudience || undefined,
          tone: profileData.tone || undefined,
          mainTheme: profileData.mainTheme || undefined,
          collaborations: profileData.collaborations || undefined,
        });

        // Update profile with generated content
        const updatedProfile = await storage.updateArtistProfile(profileData.userId, {
          shortBio: generatedContent.shortBio,
          longBio: generatedContent.longBio,
          pressRelease: generatedContent.pressRelease,
        });

        res.json(updatedProfile);
      } catch (aiError) {
        // Return profile even if AI generation fails
        res.json(profile);
      }
    } catch (error) {
      console.error("Profile validation error:", error);
      res.status(400).json({ 
        message: "Invalid profile data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Generate cover art
  app.post("/api/content/cover", async (req, res) => {
    try {
      const { userId, title, prompt, style } = req.body;
      
      if (!userId || !title || !prompt) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Create content record
      const contentData = insertGeneratedContentSchema.parse({
        userId,
        type: "cover",
        title,
        prompt,
        style: style || "modern",
        format: "png",
        size: "1024x1024",
        status: "pending",
        tokensUsed: 10, // Estimate for DALL-E
      });

      const content = await storage.createGeneratedContent(contentData);

      try {
        // Generate cover art using AI
        const result = await generateCoverArt(prompt, style || "modern");
        
        // Update content with generated image URL
        const updatedContent = await storage.updateGeneratedContent(content.id, {
          fileUrl: result.imageUrl,
          status: "completed",
        });

        res.json(updatedContent);
      } catch (aiError) {
        // Update status to failed
        await storage.updateGeneratedContent(content.id, {
          status: "failed",
        });
        
        res.status(500).json({ 
          message: "Cover generation failed", 
          error: "AI service unavailable"
        });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  // Get user's generated content (default user)
  app.get("/api/content", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const content = await storage.getGeneratedContent(userId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Image search API endpoints
  app.get("/api/search-images", async (req, res) => {
    try {
      const { q: query, type = 'pexels' } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      let images: any[] = [];

      if (type === 'pexels' && process.env.PEXELS_API_KEY) {
        try {
          const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query as string)}&per_page=20&orientation=square`, {
            headers: {
              'Authorization': process.env.PEXELS_API_KEY
            }
          });

          if (response.ok) {
            const data = await response.json();
            images = data.photos.map((photo: any) => ({
              id: `pexels-${photo.id}`,
              url: photo.src.large,
              photographer: photo.photographer,
              source: 'pexels',
              width: photo.width,
              height: photo.height
            }));
          }
        } catch (error) {
          console.log('Pexels API error:', error);
        }
      }

      if (type === 'pixabay' && process.env.PIXABAY_API_KEY) {
        try {
          const response = await fetch(`https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query as string)}&image_type=photo&orientation=all&category=music&min_width=1000&min_height=1000&per_page=20`);

          if (response.ok) {
            const data = await response.json();
            const pixabayImages = data.hits.map((hit: any) => ({
              id: `pixabay-${hit.id}`,
              url: hit.largeImageURL,
              photographer: hit.user,
              source: 'pixabay',
              width: hit.imageWidth,
              height: hit.imageHeight
            }));
            images = [...images, ...pixabayImages];
          }
        } catch (error) {
          console.log('Pixabay API error:', error);
        }
      }

      res.json({ images });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Serve images from database
  app.get('/api/image/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const content = await storage.getGeneratedContentById(parseInt(id));
      
      if (!content || !content.fileData) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const buffer = Buffer.from(content.fileData, 'base64');
      res.set('Content-Type', content.fileType || 'image/jpeg');
      res.set('Content-Length', buffer.length.toString());
      res.send(buffer);
    } catch (error) {
      console.error('Image serve error:', error);
      res.status(500).json({ message: 'Failed to serve image' });
    }
  });

  // Get user's generated content by userId
  app.get("/api/content/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const content = await storage.getGeneratedContent(userId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Get chart entries
  app.get("/api/charts", async (req, res) => {
    try {
      const { platform } = req.query;
      const charts = await storage.getChartEntries(platform as string);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  // Create scheduled post
  app.post("/api/posts/schedule", async (req, res) => {
    try {
      const postData = insertScheduledPostSchema.parse(req.body);
      const post = await storage.createScheduledPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  // Get user's scheduled posts
  app.get("/api/posts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const posts = await storage.getScheduledPosts(userId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Get dashboard stats for music platform
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      
      const profile = await storage.getArtistProfile(userId);
      const content = await storage.getGeneratedContent(userId);
      const posts = await storage.getScheduledPosts(userId);
      const charts = await storage.getChartEntries();

      const stats = {
        hasProfile: !!profile,
        totalContent: content.length,
        scheduledPosts: posts.length,
        chartsAvailable: charts.length,
        recentContent: content.slice(0, 3),
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // SVG Templates admin API
  app.get("/api/admin/templates", async (req, res) => {
    try {
      const templates = await storage.getSvgTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching SVG templates:", error);
      res.status(500).json({ message: "Failed to fetch SVG templates" });
    }
  });

  app.get("/api/admin/templates/:id", async (req, res) => {
    try {
      const template = await storage.getSvgTemplateById(parseInt(req.params.id));
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching SVG template:", error);
      res.status(500).json({ message: "Failed to fetch SVG template" });
    }
  });

  app.post("/api/admin/templates", async (req, res) => {
    try {
      const template = await storage.createSvgTemplate(req.body);
      res.json(template);
    } catch (error) {
      console.error("Error creating SVG template:", error);
      res.status(500).json({ message: "Failed to create SVG template" });
    }
  });

  app.patch("/api/admin/templates/:id", async (req, res) => {
    try {
      const template = await storage.updateSvgTemplate(parseInt(req.params.id), req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating SVG template:", error);
      res.status(500).json({ message: "Failed to update SVG template" });
    }
  });

  app.delete("/api/admin/templates/:id", async (req, res) => {
    try {
      const success = await storage.deleteSvgTemplate(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting SVG template:", error);
      res.status(500).json({ message: "Failed to delete SVG template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
