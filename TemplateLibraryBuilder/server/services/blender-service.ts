import { spawn, execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BLENDER_PATHS } from '../blender-paths.js';

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

export interface PreviewResult {
  success: boolean;
  previewPath?: string;
  error?: string;
  renderTime?: number;
}

export class BlenderService {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  private static readonly SCRIPT_PATH = BLENDER_PATHS.SCRIPT_PATH;
  private static readonly DEFAULT_TEMPLATE = BLENDER_PATHS.TEMPLATE_PATH;

  // Log para debug - forçar reload
  static {
    console.log('🔄 BlenderService reloaded - Template path:', BlenderService.DEFAULT_TEMPLATE);
  }

  /**
   * Renderiza um audio visualizer usando Blender
   */
  static async renderAudioVisualizer(options: BlenderRenderOptions): Promise<BlenderRenderResult> {
    const startTime = Date.now();
    const outputPath = options.outputPath || path.join(process.cwd(), 'Blender', 'output.mp4');
    const templatePath = options.templatePath || this.DEFAULT_TEMPLATE;

    try {
      // Validar se os arquivos existem
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

      if (!fs.existsSync(this.SCRIPT_PATH)) {
        throw new Error(`Python script not found: ${this.SCRIPT_PATH}`);
      }

      // Limpar output anterior se existir
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      console.log('🎬 Starting Blender render...');
      console.log(`Audio: ${options.audioPath}`);
      console.log(`Image: ${options.imagePath}`);
      console.log(`Template: ${templatePath}`);
      console.log(`Output: ${outputPath}`);

      // Executar Blender
      const result = await this.executeBlender(templatePath, [
        options.audioPath,
        options.imagePath,
        outputPath  // Adicionar outputPath como terceiro argumento
      ]);

      if (!result.success) {
        throw new Error(result.error || 'Blender execution failed');
      }

      // Verificar se o arquivo foi gerado
      if (!fs.existsSync(outputPath)) {
        throw new Error('Output file was not generated');
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Render completed in ${duration}ms`);

      return {
        success: true,
        outputPath,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Blender render failed:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }

  /**
   * Executa o Blender com o script Python usando PowerShell para resolver problemas com espaços
   */
  private static executeBlender(templatePath: string, scriptArgs: string[]): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const args = [
        '--background',           // Executar sem interface
        templatePath,            // Arquivo .blend
        '--python',              // Executar script Python
        this.SCRIPT_PATH,        // Caminho do script
        '--',                    // Separador para argumentos do script
        ...scriptArgs            // Argumentos para o script
      ];

      // Construir comando PowerShell para lidar com espaços no caminho
      const powershellCommand = `& "${this.BLENDER_PATH}" ${args.join(' ')}`;
      console.log(`Executing via PowerShell: ${powershellCommand}`);

      // Usar PowerShell para executar o Blender
      const blenderProcess = spawn('powershell', ['-Command', powershellCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      // Timeout para evitar travamento
      const timeout = setTimeout(() => {
        console.log('⏰ Blender process timeout, killing...');
        blenderProcess.kill('SIGTERM');
        hasError = true;
      }, 30000); // 30 segundos

      blenderProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log('Blender:', output.trim());
      });

      blenderProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.error('Blender Error:', output.trim());
      });

      blenderProcess.on('error', (error) => {
        console.error('❌ Blender spawn error:', error.message);
        clearTimeout(timeout);
        hasError = true;
        resolve({ 
          success: false, 
          error: `Failed to start Blender: ${error.message}` 
        });
      });

      blenderProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (hasError) return; // Já resolveu com erro
        
        if (code === 0) {
          console.log('✅ Blender process completed successfully');
          resolve({ success: true });
        } else {
          console.error(`❌ Blender process exited with code ${code}`);
          resolve({ 
            success: false, 
            error: `Blender process failed with exit code ${code}. Error: ${stderr || 'No error details'}` 
          });
        }
      });

      blenderProcess.on('error', (error) => {
        console.error('❌ Failed to start Blender process:', error);
        resolve({ 
          success: false, 
          error: `Failed to start Blender: ${error.message}` 
        });
      });
    });
  }

  /**
   * Testa se o Blender está funcionando
   */
  static async testBlenderInstallation(): Promise<boolean> {
    try {
      const result = await new Promise<boolean>((resolve) => {
        console.log(`🔄 Testing Blender at: ${this.BLENDER_PATH}`);
        
        // Usar PowerShell para executar o Blender com path que contém espaços
        const powershellCommand = `& "${this.BLENDER_PATH}" --version`;
        console.log(`Testing via PowerShell: ${powershellCommand}`);
        
        const testProcess = spawn('powershell', ['-Command', powershellCommand], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        testProcess.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        testProcess.stderr?.on('data', (data) => {
          stderr += data.toString();
        });

        testProcess.on('close', (code) => {
          console.log(`🔄 Blender test exit code: ${code}`);
          console.log(`🔄 Blender test stdout: ${stdout.trim()}`);
          if (stderr) {
            console.log(`🔄 Blender test stderr: ${stderr.trim()}`);
          }
          resolve(code === 0);
        });

        testProcess.on('error', (error) => {
          console.error('❌ Blender test error:', error.message);
          resolve(false);
        });

        // Timeout de 10 segundos
        setTimeout(() => {
          testProcess.kill();
          console.log('⏰ Blender test timeout');
          resolve(false);
        }, 10000);
      });

      return result;
    } catch (error) {
      console.error('❌ Blender test exception:', error);
      return false;
    }
  }

  /**
   * Gera um preview de um único frame do template.blend com imagem aplicada
   */
  async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    const timestamp = Date.now();
    
    // Garantir que o diretório existe
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`📁 Created uploads directory: ${uploadsDir}`);
    }
    
    const outputPath = path.join(uploadsDir, `preview_${timestamp}.png`);
    // Usar template original que funcionou ontem
    const templatePath = path.join(process.cwd(), 'Blender', 'template.blend');

    console.log('🔄 DEBUG - Template path:', templatePath);
    console.log('🔄 DEBUG - Template exists:', fs.existsSync(templatePath));
    console.log('🔄 DEBUG - Output path:', outputPath);

    try {
      // Validar se os arquivos existem (áudio não é necessário para preview)
      if (!fs.existsSync(options.imageFile)) {
        throw new Error(`Image file not found: ${options.imageFile}`);
      }

      if (!fs.existsSync(options.imageFile)) {
        throw new Error(`Image file not found: ${options.imageFile}`);
      }

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
      }

      if (!fs.existsSync(BlenderService.BLENDER_PATH)) {
        throw new Error(`Blender not found at: ${BlenderService.BLENDER_PATH}`);
      }

      console.log('🎬 Starting complete template preview generation...');
      console.log(`🎵 Audio: ${options.audioFile}`);
      console.log(`�️ Image: ${options.imageFile}`);
      console.log(`�📷 Camera: Distance=${options.cameraSettings.distance}%, Height=${options.cameraSettings.height}%, Angle=${options.cameraSettings.angle}%`);
      console.log(`🎨 Render Engine: ${options.renderEngine.toUpperCase()}`);
      console.log(`⚡ Animation: ${options.animationStyle}, Sensitivity=${options.sensitivity}%, Smoothing=${options.smoothing}%`);

      return new Promise((resolve) => {
        const args = [
          '--background',
          templatePath,
          '--python',
          path.join(process.cwd(), 'Blender', 'preview_script.py'),
          '--',
          outputPath
        ];

        // Usar PowerShell para executar o Blender com paths que contêm espaços
        const powershellCommand = `& "${BlenderService.BLENDER_PATH}" ${args.join(' ')}`;
        console.log(`🔄 Executing via PowerShell: ${powershellCommand}`);

        const blenderProcess = spawn('powershell', ['-Command', powershellCommand], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';
        let hasError = false;

        // Timeout para evitar travamento
        const timeout = setTimeout(() => {
          console.log('⏰ Blender process timeout, killing...');
          blenderProcess.kill('SIGTERM');
          hasError = true;
          resolve({
            success: false,
            error: 'Blender process timeout',
            renderTime: Date.now() - startTime
          });
        }, 30000);

        blenderProcess.stdout?.on('data', (data) => {
          const output = data.toString();
          stdout += output;
          console.log('[Blender Preview]', output.trim());
        });

        blenderProcess.stderr?.on('data', (data) => {
          const output = data.toString();
          stderr += output;
          console.error('[Blender Preview Error]', output.trim());
        });

        blenderProcess.on('error', (error) => {
          console.error('❌ PowerShell process error:', error);
          clearTimeout(timeout);
          hasError = true;
          resolve({
            success: false,
            error: `Failed to start PowerShell process: ${error.message}`,
            renderTime: Date.now() - startTime
          });
        });

        blenderProcess.on('close', (code) => {
          clearTimeout(timeout);
          if (hasError) return;
          
          const renderTime = Date.now() - startTime;
          
          if (code === 0) {
            if (fs.existsSync(outputPath)) {
              console.log(`✅ Preview generated successfully in ${renderTime}ms`);
              resolve({
                success: true,
                previewPath: outputPath,
                renderTime
              });
            } else {
              console.error(`❌ Preview file not generated: ${outputPath}`);
              resolve({
                success: false,
                error: `Preview file was not generated. Stderr: ${stderr}`,
                renderTime
              });
            }
          } else {
            console.error(`❌ Blender process exited with code ${code}`);
            resolve({
              success: false,
              error: `Blender process failed with exit code ${code}. Error: ${stderr}`,
              renderTime
            });
          }
        });
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during preview generation'
      };
    }
  }
}
