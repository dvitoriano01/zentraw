import { spawn, execSync, exec } from 'child_process';
import crossSpawn from 'cross-spawn';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { BLENDER_PATHS } from '../blender-paths.ts';

const execAsync = promisify(exec);

export interface BlenderMethod {
  name: string;
  strategy: string;
  execute: () => Promise<{ success: boolean; output?: string; error?: string; strategy?: string }>;
}

export class BlenderServiceRobustV2 {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  
  // 🔧 MÚLTIPLAS ESTRATÉGIAS DE EXECUÇÃO (conforme orientações do team AI)
  private static readonly EXECUTION_STRATEGIES = [
    'CROSS_SPAWN',      // cross-spawn package (mais robusto)
    'POWERSHELL',       // PowerShell wrapper
    'NATIVE_SPAWN',     // spawn nativo com shell: true
    'EXEC_ALTERNATIVE', // exec em vez de spawn
    'SHORT_PATH'        // usar path curto se disponível
  ];
  
  /**
   * 🔥 SISTEMA ROBUSTO V2: Implementa TODAS as soluções do team AI
   */
  static async generatePreviewWithFallback(outputPath: string): Promise<{ 
    success: boolean; 
    method?: string; 
    strategy?: string; 
    error?: string; 
    output?: string;
    detailedLogs?: string[];
  }> {
    console.log('🔥🔥 SISTEMA ROBUSTO V2 INICIADO - Múltiplas estratégias implementadas! 🔥🔥');
    console.log('🎯 Output path:', outputPath);
    console.log('🔧 Blender path:', BLENDER_PATHS.BLENDER_EXE);
    
    // ✅ VERIFICAÇÕES PRÉ-EXECUÇÃO (conforme orientação do team AI)
    await this.performPreExecutionChecks();
    
    const detailedLogs: string[] = [];
    
    // 🎭 MÉTODOS COMBINADOS COM ESTRATÉGIAS
    const methods: BlenderMethod[] = [
      // EEVEE com todas as estratégias
      ...this.EXECUTION_STRATEGIES.map(strategy => ({
        name: 'EEVEE_ORIGINAL',
        strategy,
        execute: () => this.executeBlenderWithStrategy(outputPath, 'BLENDER_EEVEE', strategy)
      })),
      
      // CYCLES com estratégias mais estáveis
      {
        name: 'CYCLES',
        strategy: 'CROSS_SPAWN',
        execute: () => this.executeBlenderWithStrategy(outputPath, 'CYCLES', 'CROSS_SPAWN')
      },
      {
        name: 'CYCLES',
        strategy: 'POWERSHELL',
        execute: () => this.executeBlenderWithStrategy(outputPath, 'CYCLES', 'POWERSHELL')
      },
      
      // WORKBENCH como fallback
      {
        name: 'WORKBENCH',
        strategy: 'CROSS_SPAWN',
        execute: () => this.executeBlenderWithStrategy(outputPath, 'BLENDER_WORKBENCH', 'CROSS_SPAWN')
      },
      
      // FACTORY RESET
      {
        name: 'FACTORY_RESET',
        strategy: 'POWERSHELL',
        execute: () => this.executeFactoryReset(outputPath)
      },
      
      // MINIMAL SCENE como último recurso
      {
        name: 'MINIMAL_SCENE',
        strategy: 'CROSS_SPAWN',
        execute: () => this.executeMinimalScene(outputPath)
      }
    ];

    for (const method of methods) {
      const logEntry = `\n🧪 ============ TESTANDO: ${method.name} | ESTRATÉGIA: ${method.strategy} ============`;
      console.log(logEntry);
      detailedLogs.push(logEntry);
      console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);
      
      try {
        const result = await method.execute();
        const resultLog = `📊 Resultado para ${method.name}/${method.strategy}: ${JSON.stringify(result)}`;
        console.log(resultLog);
        detailedLogs.push(resultLog);
        
        if (result.success) {
          const successLog = `✅ ✅ ✅ SUCESSO! ${method.name} com ${method.strategy} funcionou! ✅ ✅ ✅`;
          console.log(successLog);
          detailedLogs.push(successLog);
          
          return {
            success: true,
            method: method.name,
            strategy: method.strategy,
            output: result.output,
            detailedLogs
          };
        } else {
          const errorLog = `❌ FALHA ${method.name}/${method.strategy}: ${result.error}`;
          console.log(errorLog);
          detailedLogs.push(errorLog);
        }
      } catch (error) {
        const exceptionLog = `💥 EXCEÇÃO ${method.name}/${method.strategy}: ${error}`;
        console.log(exceptionLog);
        detailedLogs.push(exceptionLog);
      }
    }

    console.log('\n🚫 TODOS OS MÉTODOS E ESTRATÉGIAS FALHARAM 🚫');
    return {
      success: false,
      error: 'Todas as combinações de métodos e estratégias falharam',
      detailedLogs
    };
  }

  /**
   * 📋 VERIFICAÇÕES PRÉ-EXECUÇÃO (conforme team AI)
   */
  private static async performPreExecutionChecks(): Promise<void> {
    console.log('\n📋 ===== VERIFICAÇÕES PRÉ-EXECUÇÃO =====');
    
    // Verificar caminho principal
    console.log('Path exists (main):', fs.existsSync(BLENDER_PATHS.BLENDER_EXE));
    
    if (fs.existsSync(BLENDER_PATHS.BLENDER_EXE)) {
      const stats = fs.statSync(BLENDER_PATHS.BLENDER_EXE);
      console.log('Path stats (main):', {
        size: stats.size,
        isFile: stats.isFile(),
        mode: stats.mode.toString(8) // permissions em octal
      });
    }
    
    // Verificar caminho fallback
    if (BLENDER_PATHS.BLENDER_EXE_ORIGINAL) {
      console.log('Path exists (original):', fs.existsSync(BLENDER_PATHS.BLENDER_EXE_ORIGINAL));
    }
    
    // Informações do sistema
    console.log('Process platform:', process.platform);
    console.log('Node version:', process.version);
    console.log('CWD:', process.cwd());
    console.log('PATH env:', process.env.PATH?.includes('Blender') ? 'Blender encontrado no PATH' : 'Blender NÃO no PATH');
    
    // Testar comando simples
    try {
      const versionTest = await this.testBlenderVersion();
      console.log('Version test result:', versionTest);
    } catch (error) {
      console.log('Version test failed:', error);
    }
    
    console.log('===== FIM VERIFICAÇÕES PRÉ-EXECUÇÃO =====\n');
  }

  /**
   * 🚀 ESTRATÉGIA 1: CROSS-SPAWN (Mais robusta para Windows)
   */
  private static async executeWithCrossSpawn(args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('🚀 Executando com CROSS-SPAWN...');
    console.log('📝 Comando:', `${BLENDER_PATHS.BLENDER_EXE} ${args.join(' ')}`);
    
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      
      const process = crossSpawn(BLENDER_PATHS.BLENDER_EXE, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
        console.log('[CROSS-SPAWN STDOUT]:', data.toString().trim());
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
        console.log('[CROSS-SPAWN STDERR]:', data.toString().trim());
      });

      process.on('error', (error) => {
        console.error('❌ CROSS-SPAWN Error:', error);
        resolve({
          success: false,
          error: `Cross-spawn error: ${error.message}`
        });
      });

      process.on('close', (code) => {
        console.log(`🔚 CROSS-SPAWN finished with code: ${code}`);
        resolve({
          success: code === 0,
          output: stdout,
          error: code !== 0 ? `Exit code ${code}. STDERR: ${stderr}` : undefined
        });
      });

      // Timeout de 45 segundos
      setTimeout(() => {
        console.log('⏰ CROSS-SPAWN timeout, killing process...');
        process.kill('SIGTERM');
        resolve({
          success: false,
          error: 'Process timeout (45s)'
        });
      }, 45000);
    });
  }

  /**
   * 🔧 ESTRATÉGIA 2: POWERSHELL WRAPPER
   */
  private static async executeWithPowerShell(args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('🔧 Executando com POWERSHELL...');
    
    const command = `& "${BLENDER_PATHS.BLENDER_EXE}" ${args.join(' ')}`;
    console.log('📝 PowerShell command:', command);
    
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      
      const process = spawn('powershell.exe', ['-Command', command], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
        console.log('[POWERSHELL STDOUT]:', data.toString().trim());
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
        console.log('[POWERSHELL STDERR]:', data.toString().trim());
      });

      process.on('error', (error) => {
        console.error('❌ POWERSHELL Error:', error);
        resolve({
          success: false,
          error: `PowerShell error: ${error.message}`
        });
      });

      process.on('close', (code) => {
        console.log(`🔚 POWERSHELL finished with code: ${code}`);
        resolve({
          success: code === 0,
          output: stdout,
          error: code !== 0 ? `Exit code ${code}. STDERR: ${stderr}` : undefined
        });
      });

      // Timeout
      setTimeout(() => {
        console.log('⏰ POWERSHELL timeout, killing process...');
        process.kill('SIGTERM');
        resolve({
          success: false,
          error: 'PowerShell process timeout (45s)'
        });
      }, 45000);
    });
  }

  /**
   * ⚡ ESTRATÉGIA 3: EXEC ALTERNATIVE
   */
  private static async executeWithExec(args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('⚡ Executando com EXEC...');
    
    const command = `"${BLENDER_PATHS.BLENDER_EXE}" ${args.join(' ')}`;
    console.log('📝 Exec command:', command);
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 45000,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      console.log('[EXEC STDOUT]:', stdout);
      if (stderr) console.log('[EXEC STDERR]:', stderr);
      
      return {
        success: true,
        output: stdout
      };
    } catch (error: any) {
      console.error('❌ EXEC Error:', error);
      return {
        success: false,
        error: `Exec error: ${error.message}`
      };
    }
  }

  /**
   * 🏭 ESTRATÉGIA 4: NATIVE SPAWN
   */
  private static async executeWithNativeSpawn(args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('🏭 Executando com NATIVE SPAWN...');
    
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      
      const process = spawn(BLENDER_PATHS.BLENDER_EXE, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true // Para Windows paths
      });

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
        console.log('[NATIVE STDOUT]:', data.toString().trim());
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
        console.log('[NATIVE STDERR]:', data.toString().trim());
      });

      process.on('error', (error) => {
        console.error('❌ NATIVE SPAWN Error:', error);
        resolve({
          success: false,
          error: `Native spawn error: ${error.message}`
        });
      });

      process.on('close', (code) => {
        console.log(`🔚 NATIVE SPAWN finished with code: ${code}`);
        resolve({
          success: code === 0,
          output: stdout,
          error: code !== 0 ? `Exit code ${code}. STDERR: ${stderr}` : undefined
        });
      });

      // Timeout
      setTimeout(() => {
        console.log('⏰ NATIVE SPAWN timeout, killing process...');
        process.kill('SIGTERM');
        resolve({
          success: false,
          error: 'Native spawn timeout (45s)'
        });
      }, 45000);
    });
  }

  /**
   * 🎯 EXECUTOR PRINCIPAL COM ESTRATÉGIAS
   */
  private static async executeBlenderWithStrategy(
    outputPath: string, 
    engine: string, 
    strategy: string
  ): Promise<{ success: boolean; output?: string; error?: string; strategy?: string }> {
    
    console.log(`🎯 Executando ${engine} com estratégia ${strategy}`);
    
    // Gerar script Python inline
    const scriptContent = this.generatePythonScript(engine, outputPath);
    const scriptPath = path.join(process.cwd(), 'uploads', `temp_${strategy}_${engine}_${Date.now()}.py`);
    
    // Criar diretório se necessário
    const uploadsDir = path.dirname(scriptPath);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Escrever script
    fs.writeFileSync(scriptPath, scriptContent);
    console.log('📝 Script criado:', scriptPath);
    
    const args = [
      '--background',
      '--python', scriptPath
    ];
    
    let result;
    
    try {
      switch (strategy) {
        case 'CROSS_SPAWN':
          result = await this.executeWithCrossSpawn(args);
          break;
        case 'POWERSHELL':
          result = await this.executeWithPowerShell(args);
          break;
        case 'EXEC_ALTERNATIVE':
          result = await this.executeWithExec(args);
          break;
        case 'NATIVE_SPAWN':
          result = await this.executeWithNativeSpawn(args);
          break;
        default:
          throw new Error(`Unknown strategy: ${strategy}`);
      }
      
      // Verificar se arquivo foi criado
      if (result.success && fs.existsSync(outputPath)) {
        console.log('✅ Arquivo de output criado com sucesso!');
        result.success = true;
      } else if (result.success) {
        console.log('❌ Processo terminou com sucesso mas arquivo não foi criado');
        result.success = false;
        result.error = 'Output file not created';
      }
      
    } finally {
      // Limpar script temporário
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
        }
      } catch (e) {
        console.log('⚠️ Não foi possível deletar script temporário:', e);
      }
    }
    
    return {
      ...result,
      strategy
    };
  }

  /**
   * 🏭 FACTORY RESET
   */
  private static async executeFactoryReset(outputPath: string): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('🏭 Executando FACTORY RESET...');
    
    const scriptContent = this.generatePythonScript('BLENDER_EEVEE', outputPath);
    const scriptPath = path.join(process.cwd(), 'uploads', `temp_factory_${Date.now()}.py`);
    
    fs.writeFileSync(scriptPath, scriptContent);
    
    const args = [
      '--background',
      '--factory-startup',
      '--python', scriptPath
    ];
    
    return this.executeWithCrossSpawn(args);
  }

  /**
   * 🎯 MINIMAL SCENE
   */
  private static async executeMinimalScene(outputPath: string): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('🎯 Executando MINIMAL SCENE...');
    
    const scriptContent = `
import bpy
import os

# Limpar cena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Criar cubo
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))

# Luz
bpy.ops.object.light_add(type='SUN', location=(4, 4, 4))

# Câmera
bpy.ops.object.camera_add(location=(7, -7, 5))
bpy.context.object.rotation_euler = (1.1, 0, 0.785)

# Render settings
bpy.context.scene.render.engine = 'BLENDER_EEVEE'
bpy.context.scene.render.resolution_x = 512
bpy.context.scene.render.resolution_y = 512
bpy.context.scene.render.filepath = "${outputPath.replace(/\\/g, '\\\\')}"
bpy.context.scene.render.image_settings.file_format = 'PNG'

# Render
bpy.ops.render.render(write_still=True)
print("✅ Minimal scene rendered successfully")
`;
    
    const scriptPath = path.join(process.cwd(), 'uploads', `temp_minimal_${Date.now()}.py`);
    fs.writeFileSync(scriptPath, scriptContent);
    
    const args = ['--background', '--python', scriptPath];
    
    return this.executeWithCrossSpawn(args);
  }

  /**
   * 📝 GERADOR DE SCRIPT PYTHON
   */
  private static generatePythonScript(engine: string, outputPath: string): string {
    return `
import bpy
import sys
import os

print(f"🎯 Script iniciado - Engine: ${engine}")
print(f"📂 Output path: ${outputPath.replace(/\\/g, '\\\\')}")

try:
    # Configurar engine
    print("⚙️ Configurando engine...")
    bpy.context.scene.render.engine = '${engine}'
    bpy.context.scene.render.resolution_x = 512
    bpy.context.scene.render.resolution_y = 512
    bpy.context.scene.render.filepath = "${outputPath.replace(/\\/g, '\\\\')}"
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    
    # Renderizar
    print("🎬 Iniciando render...")
    bpy.ops.render.render(write_still=True)
    
    # Verificar resultado
    if os.path.exists("${outputPath.replace(/\\/g, '\\\\')}"):
        print("✅ Render concluído com sucesso!")
        print(f"📁 Arquivo criado: ${outputPath.replace(/\\/g, '\\\\')}")
    else:
        print("❌ Arquivo de output não foi criado!")
        sys.exit(1)
        
except Exception as e:
    print(f"💥 Erro durante render: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
`;
  }

  /**
   * 🧪 TESTE DE VERSÃO DO BLENDER
   */
  private static async testBlenderVersion(): Promise<{ success: boolean; version?: string; error?: string }> {
    try {
      const result = await this.executeWithCrossSpawn(['--version']);
      return {
        success: result.success,
        version: result.output?.split('\n')[0],
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔍 TESTE DE INSTALAÇÃO (para uso pelo BlenderService principal)
   */
  static async testBlenderInstallation(): Promise<boolean> {
    console.log('🧪 Testando instalação do Blender...');
    
    const versionTest = await this.testBlenderVersion();
    console.log('📊 Resultado do teste de versão:', versionTest);
    
    return versionTest.success;
  }

  /**
   * 🎬 EXECUÇÃO DO VISUALIZADOR REAL COM FALLBACK
   */
  static async executeAudioVisualizerWithFallback(options: {
    blenderPath: string;
    templatePath: string;
    scriptPath: string;
    audioPath: string;
    imagePath: string;
    outputPath: string;
  }): Promise<{ 
    success: boolean; 
    method?: string; 
    strategy?: string; 
    error?: string; 
    output?: string;
    detailedLogs?: string[];
  }> {
    console.log('🎬🔥 EXECUTANDO VISUALIZADOR REAL COM MÚLTIPLAS ESTRATÉGIAS! 🔥🎬');
    console.log('📊 Options:', JSON.stringify(options, null, 2));
    
    const detailedLogs: string[] = [];
    
    // Verificações básicas
    if (!fs.existsSync(options.blenderPath)) {
      return { success: false, error: `Blender not found: ${options.blenderPath}` };
    }
    
    if (!fs.existsSync(options.templatePath)) {
      return { success: false, error: `Template not found: ${options.templatePath}` };
    }
    
    if (!fs.existsSync(options.scriptPath)) {
      return { success: false, error: `Script not found: ${options.scriptPath}` };
    }
    
    // ✅ ARGUMENTOS PARA O VISUALIZADOR REAL
    const visualizerArgs = [
      options.templatePath,
      '--background',
      '--python', options.scriptPath,
      '--',
      options.audioPath,
      options.imagePath,
      options.outputPath
    ];
    
    console.log('🎯 Visualizer args:', visualizerArgs);
    
    // 🔥 TENTAR TODAS AS ESTRATÉGIAS PARA O VISUALIZADOR
    for (const strategy of this.EXECUTION_STRATEGIES) {
      try {
        console.log(`🎬 Trying visualizer with strategy: ${strategy}`);
        detailedLogs.push(`Attempting strategy: ${strategy}`);
        
        let result;
        
        switch (strategy) {
          case 'CROSS_SPAWN':
            result = await this.executeVisualizerWithCrossSpawn(options.blenderPath, visualizerArgs);
            break;
          case 'POWERSHELL':
            result = await this.executeVisualizerWithPowerShell(options.blenderPath, visualizerArgs);
            break;
          case 'NATIVE_SPAWN':
            result = await this.executeVisualizerWithNativeSpawn(options.blenderPath, visualizerArgs);
            break;
          case 'EXEC_ALTERNATIVE':
            result = await this.executeVisualizerWithExec(options.blenderPath, visualizerArgs);
            break;
          default:
            continue;
        }
        
        if (result.success) {
          console.log(`✅ Visualizer SUCCESS with strategy: ${strategy}`);
          detailedLogs.push(`SUCCESS with ${strategy}: ${result.output}`);
          
          return {
            success: true,
            method: 'audio-visualizer',
            strategy: strategy,
            output: result.output,
            detailedLogs
          };
        } else {
          console.log(`❌ Strategy ${strategy} failed:`, result.error);
          detailedLogs.push(`FAILED ${strategy}: ${result.error}`);
        }
        
      } catch (error) {
        console.log(`💥 Strategy ${strategy} crashed:`, error);
        detailedLogs.push(`CRASHED ${strategy}: ${error}`);
      }
    }
    
    return {
      success: false,
      error: 'All strategies failed for audio visualizer',
      detailedLogs
    };
  }
  
  private static async executeVisualizerWithCrossSpawn(blenderPath: string, args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    return new Promise((resolve) => {
      console.log('🎬 CrossSpawn visualizer execution...');
      
      const child = crossSpawn(blenderPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      });

      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: error || `Process exited with code ${code}` });
        }
      });

      child.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      setTimeout(() => {
        child.kill();
        resolve({ success: false, error: 'Visualizer timeout (5 minutes)' });
      }, 300000); // 5 minutos timeout
    });
  }
  
  private static async executeVisualizerWithPowerShell(blenderPath: string, args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    return new Promise((resolve) => {
      console.log('🎬 PowerShell visualizer execution...');
      
      const argsStr = args.map(arg => `"${arg}"`).join(' ');
      const command = `& "${blenderPath}" ${argsStr}`;
      
      const child = spawn('powershell', ['-Command', command], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      });

      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: error || `Process exited with code ${code}` });
        }
      });

      child.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      setTimeout(() => {
        child.kill();
        resolve({ success: false, error: 'Visualizer timeout (5 minutes)' });
      }, 300000);
    });
  }
  
  private static async executeVisualizerWithNativeSpawn(blenderPath: string, args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    return new Promise((resolve) => {
      console.log('🎬 Native spawn visualizer execution...');
      
      const child = spawn(blenderPath, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        windowsHide: true
      });

      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: error || `Process exited with code ${code}` });
        }
      });

      child.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      setTimeout(() => {
        child.kill();
        resolve({ success: false, error: 'Visualizer timeout (5 minutes)' });
      }, 300000);
    });
  }
  
  private static async executeVisualizerWithExec(blenderPath: string, args: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    return new Promise((resolve) => {
      console.log('🎬 Exec visualizer execution...');
      
      const argsStr = args.map(arg => `"${arg}"`).join(' ');
      const command = `"${blenderPath}" ${argsStr}`;
      
      exec(command, { maxBuffer: 1024 * 1024 * 10, timeout: 300000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });
  }
}
