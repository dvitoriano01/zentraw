import { spawn, exec } from 'child_process';
import crossSpawn from 'cross-spawn';
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

export class BlenderServiceComplete {
  private static readonly BLENDER_PATHS_ALTERNATIVES = [
    'C:\\PROGRA~1\\BLENDE~1\\BLENDE~1\\blender.exe',  // Caminho curto 8.3
    'C:\\Blender\\blender.exe',                        // Sem espaços
    'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe',  // Original
    BLENDER_PATHS.BLENDER_EXE  // Da configuração atual
  ];

  private static readonly SCRIPT_PATH = BLENDER_PATHS.SCRIPT_PATH;
  private static readonly DEFAULT_TEMPLATE = BLENDER_PATHS.TEMPLATE_PATH;

  /**
   * Encontra o caminho do Blender que funciona
   */
  private static findWorkingBlenderPath(): string {
    for (const testPath of this.BLENDER_PATHS_ALTERNATIVES) {
      if (fs.existsSync(testPath)) {
        console.log(`✅ Found working Blender path: ${testPath}`);
        return testPath;
      }
    }
    console.warn('⚠️ No working Blender path found, using default');
    return this.BLENDER_PATHS_ALTERNATIVES[0];
  }

  /**
   * Método 1: cross-spawn (mais compatível com Windows)
   */
  private static async executeBlendeWithCrossSpawn(blenderPath: string, args: string[]): Promise<{ success: boolean; error?: string; stdout?: string; stderr?: string }> {
    return new Promise((resolve) => {
      console.log(`🔄 Trying cross-spawn: ${blenderPath} ${args.join(' ')}`);
      console.log(`📁 Working directory: ${process.cwd()}`);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(blenderPath)) {
        console.error(`❌ Blender executable not found: ${blenderPath}`);
        return resolve({ success: false, error: `Blender executable not found: ${blenderPath}` });
      }
      
      // Verificar permissões
      try {
        fs.accessSync(blenderPath, fs.constants.X_OK);
        console.log(`✅ Blender executable has execute permissions`);
      } catch (error) {
        console.error(`❌ Blender executable lacks execute permissions: ${error}`);
        return resolve({ success: false, error: `Blender executable lacks execute permissions: ${error}` });
      }
      
      const blenderProcess = crossSpawn(blenderPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true  // Usar shell para melhor compatibilidade
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      const timeout = setTimeout(() => {
        console.log('⏰ cross-spawn timeout (30s)');
        blenderProcess.kill();
        hasError = true;
        resolve({ success: false, error: 'cross-spawn timeout (30s)', stdout, stderr });
      }, 30000);

      blenderProcess.stdout?.on('data', (data: any) => {
        const output = data.toString();
        stdout += output;
        console.log(`[cross-spawn stdout] ${output.trim()}`);
      });

      blenderProcess.stderr?.on('data', (data: any) => {
        const output = data.toString();
        stderr += output;
        console.error(`[cross-spawn stderr] ${output.trim()}`);
      });

      blenderProcess.on('error', (error: any) => {
        console.error('❌ cross-spawn error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          errno: error.errno,
          syscall: error.syscall,
          path: error.path,
          spawnargs: error.spawnargs
        });
        clearTimeout(timeout);
        hasError = true;
        resolve({ success: false, error: `cross-spawn error: ${error.message}`, stdout, stderr });
      });

      blenderProcess.on('close', (code: any) => {
        clearTimeout(timeout);
        if (hasError) return;
        
        console.log(`🏁 cross-spawn process closed with code: ${code}`);
        
        if (code === 0) {
          console.log('✅ cross-spawn success');
          resolve({ success: true, stdout, stderr });
        } else {
          console.error(`❌ cross-spawn exit code: ${code}`);
          console.error(`❌ Full stderr: ${stderr}`);
          console.error(`❌ Full stdout: ${stdout}`);
          resolve({ success: false, error: `cross-spawn exit code ${code}. stderr: ${stderr}`, stdout, stderr });
        }
      });
    });
  }

  /**
   * Método 2: PowerShell wrapper
   */
  private static async executeBlenderWithPowerShell(blenderPath: string, args: string[]): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const powershellCommand = `& "${blenderPath}" ${args.join(' ')}`;
      console.log(`🔄 Trying PowerShell: ${powershellCommand}`);
      
      const blenderProcess = spawn('powershell', ['-Command', powershellCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      const timeout = setTimeout(() => {
        console.log('⏰ PowerShell timeout');
        blenderProcess.kill();
        hasError = true;
        resolve({ success: false, error: 'PowerShell timeout' });
      }, 30000);

      blenderProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
        console.log('[PowerShell stdout]', data.toString().trim());
      });

      blenderProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
        console.error('[PowerShell stderr]', data.toString().trim());
      });

      blenderProcess.on('error', (error) => {
        console.error('❌ PowerShell error:', error.message);
        clearTimeout(timeout);
        hasError = true;
        resolve({ success: false, error: `PowerShell error: ${error.message}` });
      });

      blenderProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (hasError) return;
        
        if (code === 0) {
          console.log('✅ PowerShell success');
          resolve({ success: true });
        } else {
          console.error(`❌ PowerShell exit code: ${code}`);
          resolve({ success: false, error: `PowerShell exit code ${code}. stderr: ${stderr}` });
        }
      });
    });
  }

  /**
   * Método 3: util.promisify + exec
   */
  private static async executeBlenderWithExec(blenderPath: string, args: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const command = `"${blenderPath}" ${args.join(' ')}`;
      console.log(`🔄 Trying exec: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10,
        timeout: 30000
      });

      console.log('[exec stdout]', stdout.trim());
      if (stderr) {
        console.error('[exec stderr]', stderr.trim());
      }

      console.log('✅ exec success');
      return { success: true };
    } catch (error) {
      console.error('❌ exec error:', error);
      return { success: false, error: `exec error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  /**
   * Testa todos os métodos e retorna o que funcionar
   */
  static async testAllMethods(): Promise<string> {
    console.log('🔍 Testing all Blender execution methods...');
    
    const blenderPath = this.findWorkingBlenderPath();
    const testArgs = ['--version'];

    // Método 1: cross-spawn
    try {
      const crossSpawnResult = await this.executeBlendeWithCrossSpawn(blenderPath, testArgs);
      if (crossSpawnResult.success) {
        console.log('✅ cross-spawn method works!');
        return 'cross-spawn';
      }
    } catch (error) {
      console.log('❌ cross-spawn method failed:', error);
    }

    // Método 2: PowerShell
    try {
      const powershellResult = await this.executeBlenderWithPowerShell(blenderPath, testArgs);
      if (powershellResult.success) {
        console.log('✅ PowerShell method works!');
        return 'powershell';
      }
    } catch (error) {
      console.log('❌ PowerShell method failed:', error);
    }

    // Método 3: exec
    try {
      const execResult = await this.executeBlenderWithExec(blenderPath, testArgs);
      if (execResult.success) {
        console.log('✅ exec method works!');
        return 'exec';
      }
    } catch (error) {
      console.log('❌ exec method failed:', error);
    }

    console.log('❌ No working method found');
    return 'none';
  }

  /**
   * Executa o Blender com o melhor método disponível
   */
  private static async executeBlender(templatePath: string, scriptArgs: string[]): Promise<{ success: boolean; error?: string }> {
    const blenderPath = this.findWorkingBlenderPath();
    const args = [
      '--background',
      templatePath,
      '--python',
      this.SCRIPT_PATH,
      '--',
      ...scriptArgs
    ];

    console.log(`🔄 Executing Blender with args: ${args.join(' ')}`);

    // Tenta cross-spawn primeiro
    const crossSpawnResult = await this.executeBlendeWithCrossSpawn(blenderPath, args);
    if (crossSpawnResult.success) {
      return crossSpawnResult;
    }

    // Tenta PowerShell
    const powershellResult = await this.executeBlenderWithPowerShell(blenderPath, args);
    if (powershellResult.success) {
      return powershellResult;
    }

    // Tenta exec
    const execResult = await this.executeBlenderWithExec(blenderPath, args);
    if (execResult.success) {
      return execResult;
    }

    return { success: false, error: 'All methods failed' };
  }

  /**
   * Testa se o Blender está funcionando
   */
  static async testBlenderInstallation(): Promise<boolean> {
    try {
      const workingMethod = await this.testAllMethods();
      return workingMethod !== 'none';
    } catch (error) {
      console.error('❌ Blender test exception:', error);
      return false;
    }
  }

  /**
   * Gera um preview usando o método que funcionar
   */
  async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    const timestamp = Date.now();
    
    console.log('🎬 Starting preview generation with options:', options);
    
    const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`📁 Created uploads directory: ${uploadsDir}`);
    }
    
    const outputPath = path.join(uploadsDir, `preview_${timestamp}.png`);
    const templatePath = path.join(process.cwd(), 'Blender', 'template.blend');

    try {
      // Validações detalhadas
      console.log('🔍 Validating files...');
      console.log(`📄 Template path: ${templatePath}`);
      console.log(`📄 Audio file: ${options.audioFile}`);
      console.log(`📄 Image file: ${options.imageFile}`);
      console.log(`📄 Output path: ${outputPath}`);
      
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
      }
      
      if (!fs.existsSync(options.audioFile)) {
        throw new Error(`Audio file not found: ${options.audioFile}`);
      }
      
      if (!fs.existsSync(options.imageFile)) {
        throw new Error(`Image file not found: ${options.imageFile}`);
      }
      
      // Verificar tamanhos dos arquivos
      const templateStats = fs.statSync(templatePath);
      const audioStats = fs.statSync(options.audioFile);
      const imageStats = fs.statSync(options.imageFile);
      
      console.log('📊 File sizes:', {
        template: `${templateStats.size} bytes`,
        audio: `${audioStats.size} bytes`,
        image: `${imageStats.size} bytes`
      });

      console.log('🎬 Starting complete preview generation...');
      
      const result = await BlenderServiceComplete.executeBlender(templatePath, [outputPath]);

      if (result.success) {
        const renderTime = Date.now() - startTime;
        
        console.log('✅ Blender execution successful, checking output file...');
        
        if (fs.existsSync(outputPath)) {
          const outputStats = fs.statSync(outputPath);
          console.log(`✅ Preview file created: ${outputPath} (${outputStats.size} bytes)`);
          
          return {
            success: true,
            previewPath: outputPath,
            renderTime
          };
        } else {
          console.error('❌ Preview file was not generated at expected location');
          return {
            success: false,
            error: `Preview file was not generated at: ${outputPath}`,
            renderTime
          };
        }
      } else {
        console.error('❌ Blender execution failed:', result.error);
        return {
          success: false,
          error: result.error || 'Blender execution failed',
          renderTime: Date.now() - startTime
        };
      }

    } catch (error) {
      console.error('❌ Preview generation exception:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        renderTime: Date.now() - startTime
      };
    }
  }
}
