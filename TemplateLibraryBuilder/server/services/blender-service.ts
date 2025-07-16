import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

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

export class BlenderService {
  private static readonly BLENDER_PATH = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';
  private static readonly SCRIPT_PATH = path.join(process.cwd(), 'Blender', 'render_audio_visualizer.py');
  private static readonly DEFAULT_TEMPLATE = path.join(process.cwd(), 'Blender', 'template.blend.blend');

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
        options.imagePath
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
   * Executa o Blender com o script Python
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

      console.log(`Executing: ${this.BLENDER_PATH} ${args.join(' ')}`);

      const blenderProcess = spawn(this.BLENDER_PATH, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

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

      blenderProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Blender process completed successfully');
          resolve({ success: true });
        } else {
          console.error(`❌ Blender process exited with code ${code}`);
          resolve({ 
            success: false, 
            error: `Blender process failed with exit code ${code}. Error: ${stderr}` 
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

      // Timeout de 5 minutos
      setTimeout(() => {
        blenderProcess.kill('SIGTERM');
        resolve({ 
          success: false, 
          error: 'Blender process timed out (5 minutes)' 
        });
      }, 5 * 60 * 1000);
    });
  }

  /**
   * Testa se o Blender está funcionando
   */
  static async testBlenderInstallation(): Promise<boolean> {
    try {
      const result = await new Promise<boolean>((resolve) => {
        const testProcess = spawn(this.BLENDER_PATH, ['--version'], { 
          stdio: ['pipe', 'pipe', 'pipe'],
          shell: true 
        });

        testProcess.on('close', (code) => {
          resolve(code === 0);
        });

        testProcess.on('error', () => {
          resolve(false);
        });
      });

      return result;
    } catch {
      return false;
    }
  }
}
