import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { BLENDER_PATHS } from '../blender-paths.js';

const execAsync = promisify(exec);

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

export class BlenderServiceAlternative {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  private static readonly SCRIPT_PATH = BLENDER_PATHS.SCRIPT_PATH;
  private static readonly DEFAULT_TEMPLATE = BLENDER_PATHS.TEMPLATE_PATH;

  /**
   * Executa o Blender usando util.promisify + exec (alternativa ao spawn)
   */
  private static async executeBlenderWithExec(templatePath: string, scriptArgs: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const args = [
        '--background',
        `"${templatePath}"`,
        '--python',
        `"${this.SCRIPT_PATH}"`,
        '--',
        ...scriptArgs.map(arg => `"${arg}"`)
      ];

      const command = `"${this.BLENDER_PATH}" ${args.join(' ')}`;
      console.log(`Executing with exec: ${command}`);

      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 30000 // 30 seconds timeout
      });

      console.log('Blender stdout:', stdout);
      if (stderr) {
        console.error('Blender stderr:', stderr);
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Blender exec error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Executa o Blender usando PowerShell wrapper
   */
  private static executeBlenderWithPowerShell(templatePath: string, scriptArgs: string[]): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const args = [
        '--background',
        templatePath,
        '--python',
        this.SCRIPT_PATH,
        '--',
        ...scriptArgs
      ];

      const powershellCommand = `& "${this.BLENDER_PATH}" ${args.join(' ')}`;
      console.log(`Executing via PowerShell: ${powershellCommand}`);

      const blenderProcess = spawn('powershell', ['-Command', powershellCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      const timeout = setTimeout(() => {
        console.log('⏰ Blender process timeout, killing...');
        blenderProcess.kill('SIGTERM');
        hasError = true;
        resolve({ success: false, error: 'Process timeout' });
      }, 30000);

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
        console.error('❌ PowerShell process error:', error.message);
        clearTimeout(timeout);
        hasError = true;
        resolve({ 
          success: false, 
          error: `Failed to start PowerShell: ${error.message}` 
        });
      });

      blenderProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (hasError) return;
        
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
    });
  }

  /**
   * Testa ambos os métodos e retorna o que funcionar
   */
  static async testBlenderExecution(): Promise<string> {
    console.log('🔄 Testing Blender execution methods...');
    
    // Teste 1: PowerShell
    try {
      const powershellResult = await this.executeBlenderWithPowerShell(this.DEFAULT_TEMPLATE, []);
      if (powershellResult.success) {
        console.log('✅ PowerShell method works');
        return 'powershell';
      }
    } catch (error) {
      console.log('❌ PowerShell method failed:', error);
    }

    // Teste 2: exec
    try {
      const execResult = await this.executeBlenderWithExec(this.DEFAULT_TEMPLATE, []);
      if (execResult.success) {
        console.log('✅ exec method works');
        return 'exec';
      }
    } catch (error) {
      console.log('❌ exec method failed:', error);
    }

    console.log('❌ No working method found');
    return 'none';
  }

  /**
   * Gera preview usando o método que funcionar
   */
  async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    const timestamp = Date.now();
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const outputPath = path.join(uploadsDir, `preview_${timestamp}.png`);
    const templatePath = path.join(process.cwd(), 'Blender', 'template.blend');

    try {
      // Validações
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
      }

      console.log('🎬 Starting alternative preview generation...');
      
      // Tentar PowerShell primeiro
      const powershellResult = await BlenderServiceAlternative.executeBlenderWithPowerShell(
        templatePath, 
        [outputPath]
      );

      if (powershellResult.success) {
        const renderTime = Date.now() - startTime;
        
        if (fs.existsSync(outputPath)) {
          return {
            success: true,
            previewPath: outputPath,
            renderTime
          };
        } else {
          return {
            success: false,
            error: 'Preview file was not generated',
            renderTime
          };
        }
      } else {
        return {
          success: false,
          error: powershellResult.error || 'PowerShell execution failed',
          renderTime: Date.now() - startTime
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        renderTime: Date.now() - startTime
      };
    }
  }
}
