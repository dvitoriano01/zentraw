import { Canvas, Rect, Circle, Triangle, IText, FabricImage, util } from 'fabric';
import { ExportOptions, CanvasObjectProperties } from '@/types/canvas';

class CanvasService {
  createRectangle(canvas: Canvas, options?: Partial<CanvasObjectProperties>): Rect {
    const canvasCenter = { x: canvas.width! / 2, y: canvas.height! / 2 };
    const rect = new Rect({
      left: canvasCenter.x - 50,
      top: canvasCenter.y - 50,
      width: 100,
      height: 100,
      fill: '#6366f1',
      stroke: '#4f46e5',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    return rect;
  }

  createCircle(canvas: Canvas, options?: Partial<CanvasObjectProperties>): Circle {
    const canvasCenter = { x: canvas.width! / 2, y: canvas.height! / 2 };
    const circle = new Circle({
      left: canvasCenter.x,
      top: canvasCenter.y,
      radius: 50,
      fill: '#8b5cf6',
      stroke: '#7c3aed',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    
    return circle;
  }

  createTriangle(canvas: Canvas, options?: Partial<CanvasObjectProperties>): Triangle {
    const canvasCenter = { x: canvas.width! / 2, y: canvas.height! / 2 };
    const triangle = new Triangle({
      left: canvasCenter.x,
      top: canvasCenter.y,
      width: 100,
      height: 100,
      fill: '#10b981',
      stroke: '#059669',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    
    return triangle;
  }

  createText(canvas: Canvas, text: string = 'Add your text', options?: Partial<CanvasObjectProperties>): IText {
    const canvasCenter = { x: canvas.width! / 2, y: canvas.height! / 2 };
    const textObject = new IText(text, {
      left: canvasCenter.x,
      top: canvasCenter.y,
      fontFamily: 'Inter',
      fontSize: 24,
      fill: '#1f2937',
      fontWeight: 'normal',
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();
    
    return textObject;
  }

  async addImage(canvas: Canvas, imageUrl: string | File): Promise<FabricImage> {
    try {
      // Handle different image sources
      let processedUrl: string;
      
      // If it's a File object (from file input), create object URL
      if (imageUrl instanceof File) {
        processedUrl = URL.createObjectURL(imageUrl);
      } else {
        processedUrl = imageUrl;
      }
      
      // Create image with proper error handling
      const img = await FabricImage.fromURL(processedUrl, {
        crossOrigin: 'anonymous'
      }).catch(async (error) => {
        console.warn('Failed to load with CORS, trying without:', error);
        // Fallback: try loading without CORS
        return await FabricImage.fromURL(processedUrl);
      });
      
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;
      const imgWidth = img.width!;
      const imgHeight = img.height!;

      const scaleX = canvasWidth / imgWidth;
      const scaleY = canvasHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of canvas size

      // Center the image on canvas
      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      
      return img;
    } catch (error) {
      console.error('Failed to load image:', error);
      throw new Error(`Failed to load image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exportCanvas(canvas: Canvas, options: ExportOptions): Promise<string> {
    const { format, quality, transparent, scale = 1 } = options;

    let exportOptions: any = {
      format,
      quality: this.getQualityValue(quality),
      multiplier: scale,
    };

    if (format === 'png' && transparent) {
      exportOptions.backgroundColor = '';
    }

    switch (format) {
      case 'png':
        return canvas.toDataURL({ 
          format: 'png', 
          quality: exportOptions.quality, 
          multiplier: scale,
          enableRetinaScaling: false
        });
      case 'jpeg':
        return canvas.toDataURL({ 
          format: 'jpeg', 
          quality: exportOptions.quality, 
          multiplier: scale,
          enableRetinaScaling: false
        });
      case 'svg':
        return canvas.toSVG();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private getQualityValue(quality: string): number {
    switch (quality) {
      case 'standard':
        return 0.8;
      case 'high':
        return 0.95;
      case 'ultra':
        return 1.0;
      default:
        return 0.8;
    }
  }

  getResolutionScale(quality: string): number {
    switch (quality) {
      case 'standard':
        return 1; // 720p equivalent
      case 'high':
        return 1.5; // 1080p equivalent
      case 'ultra':
        return 2; // 4K equivalent
      default:
        return 1;
    }
  }

  downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadTemplate(canvas: Canvas, templateData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      canvas.loadFromJSON(templateData).then(() => {
        canvas.renderAll();
        resolve();
      }).catch(reject);
    });
  }

  saveAsTemplate(canvas: Canvas): any {
    return canvas.toJSON();
  }

  createSvgLayout(canvas: Canvas, layoutType: string): void {
    const canvasCenter = { x: canvas.width! / 2, y: canvas.height! / 2 };
    
    switch (layoutType) {
      case 'instagram-layout':
        this.createInstagramLayout(canvas, canvasCenter);
        break;
      case 'story-layout':
        this.createStoryLayout(canvas, canvasCenter);
        break;
      case 'business-card':
        this.createBusinessCardLayout(canvas, canvasCenter);
        break;
      case 'logo-layout':
        this.createLogoLayout(canvas, canvasCenter);
        break;
      case 'admin-banner':
        this.createPremiumBanner(canvas, canvasCenter);
        break;
      case 'admin-infographic':
        this.createAdvancedInfographic(canvas, canvasCenter);
        break;
      case 'premium-poster':
        this.createEventPoster(canvas, canvasCenter);
        break;
      case 'admin-certificate':
        this.createCertificateTemplate(canvas, canvasCenter);
        break;
    }
  }

  private createInstagramLayout(canvas: Canvas, center: { x: number, y: number }): void {
    // Background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 300,
      height: 300,
      fill: '#ff6b6b',
      originX: 'center',
      originY: 'center',
    });

    // Title text
    const title = new IText('Your Title Here', {
      left: center.x,
      top: center.y - 80,
      fontFamily: 'Inter',
      fontSize: 28,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Subtitle text
    const subtitle = new IText('Subtitle or description', {
      left: center.x,
      top: center.y - 40,
      fontFamily: 'Inter',
      fontSize: 16,
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Decorative circle
    const circle = new Circle({
      left: center.x,
      top: center.y + 50,
      radius: 30,
      fill: 'rgba(255, 255, 255, 0.3)',
      stroke: '#ffffff',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, title, subtitle, circle);
    canvas.renderAll();
  }

  private createStoryLayout(canvas: Canvas, center: { x: number, y: number }): void {
    // Background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 200,
      height: 350,
      fill: '#667eea',
      originX: 'center',
      originY: 'center',
    });

    // Main text
    const mainText = new IText('Story\nTitle', {
      left: center.x,
      top: center.y - 100,
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Bottom text
    const bottomText = new IText('Swipe up', {
      left: center.x,
      top: center.y + 120,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, mainText, bottomText);
    canvas.renderAll();
  }

  private createBusinessCardLayout(canvas: Canvas, center: { x: number, y: number }): void {
    // Card background
    const card = new Rect({
      left: center.x,
      top: center.y,
      width: 350,
      height: 200,
      fill: '#ffffff',
      stroke: '#e5e7eb',
      strokeWidth: 1,
      rx: 8,
      ry: 8,
      originX: 'center',
      originY: 'center',
    });

    // Company name
    const company = new IText('Your Company', {
      left: center.x - 120,
      top: center.y - 60,
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#1f2937',
      originX: 'left',
      originY: 'center',
    });

    // Name
    const name = new IText('John Doe', {
      left: center.x - 120,
      top: center.y - 20,
      fontFamily: 'Inter',
      fontSize: 18,
      fill: '#374151',
      originX: 'left',
      originY: 'center',
    });

    // Position
    const position = new IText('Position Title', {
      left: center.x - 120,
      top: center.y + 10,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#6b7280',
      originX: 'left',
      originY: 'center',
    });

    // Contact info
    const contact = new IText('email@company.com\n+1 (555) 123-4567', {
      left: center.x - 120,
      top: center.y + 50,
      fontFamily: 'Inter',
      fontSize: 12,
      fill: '#6b7280',
      originX: 'left',
      originY: 'center',
    });

    // Logo placeholder
    const logo = new Circle({
      left: center.x + 100,
      top: center.y - 20,
      radius: 40,
      fill: '#3b82f6',
      originX: 'center',
      originY: 'center',
    });

    const logoText = new IText('LOGO', {
      left: center.x + 100,
      top: center.y - 20,
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(card, company, name, position, contact, logo, logoText);
    canvas.renderAll();
  }

  private createLogoLayout(canvas: Canvas, center: { x: number, y: number }): void {
    // Logo circle
    const logoCircle = new Circle({
      left: center.x,
      top: center.y - 40,
      radius: 50,
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
    });

    // Logo text
    const logoText = new IText('LOGO', {
      left: center.x,
      top: center.y - 40,
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Company name
    const companyName = new IText('Company Name', {
      left: center.x,
      top: center.y + 30,
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: '600',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Tagline
    const tagline = new IText('Your tagline here', {
      left: center.x,
      top: center.y + 60,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(logoCircle, logoText, companyName, tagline);
    canvas.renderAll();
  }

  private createPremiumBanner(canvas: Canvas, center: { x: number, y: number }): void {
    // Premium gradient background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 400,
      height: 150,
      fill: '#667eea',
      originX: 'center',
      originY: 'center',
    });

    // Main title
    const title = new IText('PREMIUM BANNER', {
      left: center.x,
      top: center.y - 30,
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Subtitle
    const subtitle = new IText('Professional Design Solution', {
      left: center.x,
      top: center.y + 10,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Decorative elements
    const leftDecor = new Circle({
      left: center.x - 150,
      top: center.y,
      radius: 20,
      fill: 'rgba(255, 255, 255, 0.2)',
      originX: 'center',
      originY: 'center',
    });

    const rightDecor = new Circle({
      left: center.x + 150,
      top: center.y,
      radius: 20,
      fill: 'rgba(255, 255, 255, 0.2)',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, title, subtitle, leftDecor, rightDecor);
    canvas.renderAll();
  }

  private createAdvancedInfographic(canvas: Canvas, center: { x: number, y: number }): void {
    // Background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 300,
      height: 400,
      fill: '#f8fafc',
      stroke: '#e2e8f0',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Title
    const title = new IText('DATA INSIGHTS', {
      left: center.x,
      top: center.y - 150,
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#1e293b',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Chart elements
    const bar1 = new Rect({
      left: center.x - 60,
      top: center.y - 50,
      width: 30,
      height: 80,
      fill: '#3b82f6',
      originX: 'center',
      originY: 'bottom',
    });

    const bar2 = new Rect({
      left: center.x - 20,
      top: center.y - 50,
      width: 30,
      height: 120,
      fill: '#10b981',
      originX: 'center',
      originY: 'bottom',
    });

    const bar3 = new Rect({
      left: center.x + 20,
      top: center.y - 50,
      width: 30,
      height: 60,
      fill: '#f59e0b',
      originX: 'center',
      originY: 'bottom',
    });

    const bar4 = new Rect({
      left: center.x + 60,
      top: center.y - 50,
      width: 30,
      height: 100,
      fill: '#ef4444',
      originX: 'center',
      originY: 'bottom',
    });

    // Labels
    const stats = new IText('Q1: 40%\nQ2: 60%\nQ3: 30%\nQ4: 50%', {
      left: center.x,
      top: center.y + 50,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#64748b',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, title, bar1, bar2, bar3, bar4, stats);
    canvas.renderAll();
  }

  private createEventPoster(canvas: Canvas, center: { x: number, y: number }): void {
    // Poster background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 250,
      height: 350,
      fill: '#1f2937',
      originX: 'center',
      originY: 'center',
    });

    // Event title
    const eventTitle = new IText('SUMMER\nFESTIVAL', {
      left: center.x,
      top: center.y - 100,
      fontFamily: 'Inter',
      fontSize: 28,
      fontWeight: 'bold',
      fill: '#fbbf24',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Date
    const date = new IText('JULY 15-17, 2024', {
      left: center.x,
      top: center.y - 20,
      fontFamily: 'Inter',
      fontSize: 16,
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Location
    const location = new IText('Central Park', {
      left: center.x,
      top: center.y + 10,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#d1d5db',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Decorative star
    const star = new IText('★', {
      left: center.x,
      top: center.y + 60,
      fontFamily: 'Inter',
      fontSize: 40,
      fill: '#fbbf24',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Call to action
    const cta = new IText('GET TICKETS NOW', {
      left: center.x,
      top: center.y + 120,
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, eventTitle, date, location, star, cta);
    canvas.renderAll();
  }

  private createCertificateTemplate(canvas: Canvas, center: { x: number, y: number }): void {
    // Certificate background
    const background = new Rect({
      left: center.x,
      top: center.y,
      width: 400,
      height: 280,
      fill: '#ffffff',
      stroke: '#d4af37',
      strokeWidth: 8,
      originX: 'center',
      originY: 'center',
    });

    // Inner border
    const innerBorder = new Rect({
      left: center.x,
      top: center.y,
      width: 360,
      height: 240,
      fill: 'transparent',
      stroke: '#d4af37',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });

    // Certificate title
    const certTitle = new IText('CERTIFICATE OF ACHIEVEMENT', {
      left: center.x,
      top: center.y - 80,
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#d4af37',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Awarded to
    const awardedTo = new IText('This is to certify that', {
      left: center.x,
      top: center.y - 40,
      fontFamily: 'Inter',
      fontSize: 14,
      fill: '#374151',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Name placeholder
    const name = new IText('_________________', {
      left: center.x,
      top: center.y - 10,
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#1f2937',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Achievement text
    const achievement = new IText('has successfully completed the requirements', {
      left: center.x,
      top: center.y + 20,
      fontFamily: 'Inter',
      fontSize: 12,
      fill: '#374151',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    // Date and signature lines
    const dateSignature = new IText('Date: ____________    Signature: ____________', {
      left: center.x,
      top: center.y + 80,
      fontFamily: 'Inter',
      fontSize: 10,
      fill: '#6b7280',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    });

    canvas.add(background, innerBorder, certTitle, awardedTo, name, achievement, dateSignature);
    canvas.renderAll();
  }
}

export const canvasService = new CanvasService();
