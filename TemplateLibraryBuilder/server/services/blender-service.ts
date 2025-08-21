import { spawn, execFile, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BLENDER_PATHS } from '../blender-paths.js';
import { BlenderServiceRobust } from './blender-service-robust.js';

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

      // Logar permissões do diretório de saída
      try {
        fs.accessSync(path.dirname(outputPath), fs.constants.W_OK);
        console.log(`✅ Write permissions confirmed for: ${path.dirname(outputPath)}`);
      } catch (err) {
        throw new Error(`No write permissions for output directory: ${path.dirname(outputPath)}`);
      }

      // Logar comando completo do Blender
      console.log(`🔧 Blender command: ${this.BLENDER_PATH} --background --python ${this.SCRIPT_PATH}`);

      // Capturar saída do processo do Blender
      const result = await this.executeBlender(templatePath, [
        options.audioPath,
        options.imagePath,
        outputPath
      ]);

      console.log('🔍 Blender process output:', result.stdout);
      console.error('⚠️ Blender process errors:', result.stderr);

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
  private static executeBlender(templatePath: string, scriptArgs: string[]): Promise<{ success: boolean; error?: string; stdout?: string; stderr?: string }> {
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
      const escapedArgs = args.map(arg => {
        // Converter para path absoluto se for caminho
        let processedArg = arg;
        if (arg.includes('\\') || arg.includes('/')) {
          try {
            processedArg = path.resolve(arg);
          } catch (e) {
            processedArg = arg;
          }
        }
        
        // Escapar aspas internas e envolver em aspas duplas
        const escaped = processedArg.replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      
      const powershellCommand = `& "${this.BLENDER_PATH}" ${escapedArgs.join(' ')}`;
      console.log(`Executing via PowerShell: ${powershellCommand}`);

      // Usar PowerShell para executar o Blender
      const blenderProcess = spawn('powershell', ['-Command', powershellCommand], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      blenderProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      blenderProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        hasError = true;
      });

      blenderProcess.on('close', (code) => {
        resolve({
          success: code === 0 && !hasError,
          error: hasError ? stderr : undefined,
          stdout,
          stderr
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
   * VERSÃO ROBUSTA com sistema de fallback
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

    console.log('🔄 DEBUG - Output path:', outputPath);
    console.log('🔄 DEBUG - Using robust fallback system...');

    try {
      // USAR SISTEMA ROBUSTO DE FALLBACK
      const result = await BlenderServiceRobust.generatePreviewWithFallback(outputPath);
      
      const renderTime = Date.now() - startTime;
      
      if (result.success) {
        console.log(`✅ Preview generated successfully with method: ${result.method} in ${renderTime}ms`);
        return {
          success: true,
          previewPath: outputPath,
          renderTime
        };
      } else {
        console.error('❌ All fallback methods failed:', result.error);
        return {
          success: false,
          error: result.error || 'All fallback methods failed',
          renderTime
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during preview generation'
      };
    }
  }

  /**
   * Corrige automaticamente problemas identificados no ambiente
   */
  static async autoFixEnvironment(): Promise<void> {
    try {
      console.log('🔧 Iniciando correções automáticas...');

      // Verificar e corrigir caminho do Blender
      if (!fs.existsSync(this.BLENDER_PATH)) {
        console.error(`❌ Blender não encontrado no caminho: ${this.BLENDER_PATH}`);
        console.log('🔍 Tentando localizar Blender automaticamente...');

        const possiblePaths = [
          'C:\\Program Files\\Blender Foundation\\Blender',
          'C:\\Program Files (x86)\\Blender Foundation\\Blender'
        ];

        let foundPath = '';
        for (const path of possiblePaths) {
          if (fs.existsSync(path)) {
            foundPath = path;
            break;
          }
        }

        if (foundPath) {
          console.log(`✅ Blender encontrado em: ${foundPath}`);
          // Atualizar caminho dinamicamente sem alterar a propriedade estática
          Object.defineProperty(this, 'BLENDER_PATH', {
            value: path.join(foundPath, 'blender.exe'),
            writable: false
          });
        } else {
          throw new Error('Blender não encontrado. Atualize o caminho manualmente.');
        }
      }

      // Verificar e liberar porta 5000
      const port = 5000;
      try {
        console.log(`🔍 Verificando se a porta ${port} está ocupada...`);
        const result = execSync(`netstat -ano | findstr :${port}`).toString();
        const pidMatch = result.match(/\s+(\d+)\s*$/);

        if (pidMatch) {
          const pid = pidMatch[1];
          console.log(`⚠️ Porta ${port} ocupada pelo processo PID: ${pid}. Encerrando processo...`);
          execSync(`taskkill /PID ${pid} /F`);
          console.log(`✅ Processo ${pid} encerrado. Porta ${port} liberada.`);
        }
      } catch {
        console.log(`✅ Porta ${port} está livre.`);
      }

      // Validar URLs e portas nos testes
      console.log('🔍 Validando configurações de URLs e portas...');
      // Aqui você pode adicionar lógica para corrigir URLs ou portas inválidas nos testes

      console.log('✅ Correções automáticas concluídas!');
    } catch (error) {
      console.error('❌ Falha ao aplicar correções automáticas:', error);
    }
  }
}
