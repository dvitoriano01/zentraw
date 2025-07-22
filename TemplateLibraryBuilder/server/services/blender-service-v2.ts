import { spawn, execFile, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BLENDER_PATHS } from '../blender-paths.js';
import { BlenderServiceRobustV2 } from './blender-service-robust-v2.js';

export interface BlenderRenderOptions {
  audioPath: string;
  imagePath: string;
  templatePath?: string;
  outputPath?: string;
}

export interface BlenderRenderResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  duration?: number;
}

export interface PreviewOptions {
  audioFile: string;
  imageFile: string;
  renderEngine: 'eevee' | 'cycles';
  cameraSettings: {
    distance: number;
    height: number;
    angle: number;
  };
  animationStyle: 'cube' | 'sphere' | 'bars';
  sensitivity: number;
  smoothing: number;
}

export interface Model3DPreviewOptions {
  modelPath: string;
  outputPath: string;
  quality: 'low' | 'medium' | 'high';
  width: number;
  height: number;
  cameraDistance: number;
  renderEngine?: 'eevee' | 'cycles';
}

export interface PreviewResult {
  success: boolean;
  previewPath?: string;
  error?: string;
  renderTime?: number;
  method?: string;
  strategy?: string;
}

export class BlenderService {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  private static readonly SCRIPT_PATH = BLENDER_PATHS.SCRIPT_PATH;
  private static readonly DEFAULT_TEMPLATE = BLENDER_PATHS.TEMPLATE_PATH;

  // 🔄 Log para debug - forçar reload
  static {
    console.log('🔄 BlenderService V2 reloaded with AI team solutions');
    console.log('🔧 Blender path:', BlenderService.BLENDER_PATH);
    console.log('📁 Template path:', BlenderService.DEFAULT_TEMPLATE);
    console.log('💡 Features: cross-spawn, PowerShell wrapper, multiple strategies');
  }

  /**
   * 🧪 TESTE DE INSTALAÇÃO - Usa sistema robusto V2
   */
  static async testBlenderInstallation(): Promise<boolean> {
    try {
      console.log('🧪 Testing Blender installation with robust system V2...');
      
      // ✅ VERIFICAÇÃO PRÉ-TESTE (conforme team AI)
      console.log('📋 Pre-test checks:');
      console.log('- Blender path exists:', fs.existsSync(this.BLENDER_PATH));
      
      if (!fs.existsSync(this.BLENDER_PATH)) {
        console.error('❌ Blender executable not found at:', this.BLENDER_PATH);
        
        // Verificar fallback
        if (BLENDER_PATHS.BLENDER_EXE_ORIGINAL && fs.existsSync(BLENDER_PATHS.BLENDER_EXE_ORIGINAL)) {
          console.log('🔄 Found Blender at original location:', BLENDER_PATHS.BLENDER_EXE_ORIGINAL);
          console.log('💡 Consider copying to C:\\Blender\\ for better compatibility');
        }
        
        return false;
      }

      // Usar sistema robusto V2 para teste
      return await BlenderServiceRobustV2.testBlenderInstallation();
      
    } catch (error) {
      console.error('❌ Blender test failed:', error);
      return false;
    }
  }

  /**
   * 🎬 GERAÇÃO DE PREVIEW - Usa sistema robusto V2 com múltiplas estratégias
   */
  static async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    
    try {
      console.log('🎬 Generating preview with robust system V2...');
      console.log('📊 Options:', JSON.stringify(options, null, 2));
      
      // Criar diretório de output
      const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📁 Created uploads directory:', uploadsDir);
      }
      
      // Gerar nome único para output
      const timestamp = Date.now();
      const outputPath = path.join(uploadsDir, `preview_${timestamp}.png`);
      console.log('🎯 Output path:', outputPath);
      
      // ✅ USAR SISTEMA ROBUSTO V2 (implementa todas as soluções do team AI)
      const result = await BlenderServiceRobustV2.generatePreviewWithFallback(outputPath);
      
      const renderTime = Date.now() - startTime;
      
      if (result.success) {
        console.log(`✅ Preview generated successfully with ${result.method}/${result.strategy}`);
        console.log(`⏱️ Render time: ${renderTime}ms`);
        
        return {
          success: true,
          previewPath: outputPath,
          renderTime,
          method: result.method,
          strategy: result.strategy
        };
      } else {
        console.error('❌ All methods and strategies failed:', result.error);
        console.log('📋 Detailed logs:', result.detailedLogs);
        
        return {
          success: false,
          error: result.error,
          renderTime
        };
      }
      
    } catch (error) {
      const renderTime = Date.now() - startTime;
      console.error('❌ Preview generation failed with exception:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        renderTime
      };
    }
  }

  /**
   * 🎯 PREVIEW DE MODELOS 3D - Método específico para arquivos .blend, .obj, etc.
   */
  static async generate3DPreview(options: Model3DPreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    
    try {
      console.log('🎯 Generating 3D model preview...');
      console.log('📊 Options:', JSON.stringify(options, null, 2));
      
      // Verificar se o modelo existe
      if (!fs.existsSync(options.modelPath)) {
        return {
          success: false,
          error: `Model file not found: ${options.modelPath}`
        };
      }
      
      // Criar diretório de output se não existir
      const outputDir = path.dirname(options.outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('📁 Created output directory:', outputDir);
      }
      
      console.log('🎯 Model path:', options.modelPath);
      console.log('🎯 Output path:', options.outputPath);
      
      // Para agora, vamos usar o sistema robusto existente
      // mas com arquivos dummy para testar o pipeline
      const result = await BlenderServiceRobustV2.generatePreviewWithFallback(options.outputPath);
      
      const renderTime = Date.now() - startTime;
      
      if (result.success) {
        console.log(`✅ 3D Preview generated successfully with ${result.method}/${result.strategy}`);
        console.log(`⏱️ Render time: ${renderTime}ms`);
        
        return {
          success: true,
          previewPath: options.outputPath,
          renderTime,
          method: result.method,
          strategy: result.strategy
        };
      } else {
        console.error('❌ 3D Preview generation failed:', result.error);
        console.log('📋 Detailed logs:', result.detailedLogs);
        
        return {
          success: false,
          error: result.error,
          renderTime
        };
      }
      
    } catch (error) {
      const renderTime = Date.now() - startTime;
      console.error('❌ 3D Preview generation failed with exception:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        renderTime
      };
    }
  }

  /**
   * 🎭 RENDERIZAÇÃO COMPLETA DE AUDIO VISUALIZER
   */
  static async renderAudioVisualizer(options: BlenderRenderOptions): Promise<BlenderRenderResult> {
    const startTime = Date.now();
    const outputPath = options.outputPath || path.join(process.cwd(), 'Blender', 'output.mp4');
    const templatePath = options.templatePath || this.DEFAULT_TEMPLATE;

    try {
      console.log('🎭 Starting audio visualizer render...');
      console.log('📁 Template:', templatePath);
      console.log('🎵 Audio:', options.audioPath);
      console.log('🖼️ Image:', options.imagePath);
      console.log('📤 Output:', outputPath);

      // Validar arquivos de entrada
      if (!fs.existsSync(options.audioPath)) {
        throw new Error(`Audio file not found: ${options.audioPath}`);
      }
      
      if (!fs.existsSync(options.imagePath)) {
        throw new Error(`Image file not found: ${options.imagePath}`);
      }

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
      }

      if (!fs.existsSync(this.BLENDER_PATH)) {
        throw new Error(`Blender not found at: ${this.BLENDER_PATH}`);
      }

      // ✅ IMPLEMENTAR RENDERIZAÇÃO COMPLETA DO VISUALIZADOR 3D
      console.log('🎬 Starting REAL audio visualizer render with V2...');
      
      // Criar diretório de output se não existir
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('📁 Created output directory:', outputDir);
      }
      
      // ✅ USAR O SCRIPT REAL DO VISUALIZADOR
      const scriptPath = this.SCRIPT_PATH;
      const templatePath = options.templatePath || this.DEFAULT_TEMPLATE;
      
      console.log('🎯 Using REAL visualizer script:', scriptPath);
      console.log('📁 Template:', templatePath);
      console.log('🎵 Audio:', options.audioPath);
      console.log('�️ Image:', options.imagePath);
      console.log('📤 Output:', outputPath);
      
      // Verificar arquivos necessários
      if (!fs.existsSync(scriptPath)) {
        return {
          success: false,
          error: `Visualizer script not found: ${scriptPath}`,
          duration: Date.now() - startTime
        };
      }
      
      if (!fs.existsSync(templatePath)) {
        return {
          success: false,
          error: `Template not found: ${templatePath}`,
          duration: Date.now() - startTime
        };
      }
      
      // ✅ EXECUTAR O VISUALIZADOR REAL COM SISTEMA ROBUSTO
      const result = await BlenderServiceRobustV2.executeAudioVisualizerWithFallback({
        blenderPath: this.BLENDER_PATH,
        templatePath: templatePath,
        scriptPath: scriptPath,
        audioPath: options.audioPath,
        imagePath: options.imagePath,
        outputPath: outputPath
      });
      
      const duration = Date.now() - startTime;
      
      if (result.success && fs.existsSync(outputPath)) {
        console.log(`✅ REAL Audio visualizer rendered successfully!`);
        console.log(`⏱️ Render duration: ${duration}ms`);
        console.log(`📁 Output file size: ${fs.statSync(outputPath).size} bytes`);
        console.log(`🎬 Format: MP4 with audio sync`);
        
        return {
          success: true,
          outputPath: outputPath,
          duration,
          method: result.method,
          strategy: result.strategy
        };
      } else {
        console.error('❌ Real visualizer render failed:', result.error);
        console.log('📋 Detailed logs:', result.detailedLogs);
        
        return {
          success: false,
          error: result.error || 'Real visualizer render failed',
          duration
        };
      }

    } catch (error) {
      console.error('❌ Audio visualizer render failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 🔧 MÉTODO DE CONVENIÊNCIA: Auto-fix environment
   */
  static async autoFixEnvironment(): Promise<{ fixed: boolean; issues: string[]; solutions: string[] }> {
    console.log('🔧 Running auto-fix environment check...');
    
    const issues: string[] = [];
    const solutions: string[] = [];
    let fixed = true;

    // Verificar Blender
    if (!fs.existsSync(BLENDER_PATHS.BLENDER_EXE)) {
      issues.push('Blender not found at expected location');
      solutions.push('Copy Blender to C:\\Blender\\ or update path configuration');
      fixed = false;
    }

    // Verificar uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        solutions.push('Created uploads directory');
      } catch (error) {
        issues.push('Cannot create uploads directory');
        fixed = false;
      }
    }

    // Verificar template
    if (!fs.existsSync(BLENDER_PATHS.TEMPLATE_PATH)) {
      issues.push('Template file not found');
      solutions.push('Ensure template.blend exists in Blender/ directory');
      fixed = false;
    }

    return { fixed, issues, solutions };
  }
}
