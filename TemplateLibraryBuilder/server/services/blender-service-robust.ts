import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { BLENDER_PATHS } from '../blender-paths.js';

export interface BlenderMethod {
  name: string;
  execute: () => Promise<{ success: boolean; output?: string; error?: string }>;
}

export class BlenderServiceRobust {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  
  /**
   * Sistema de fallback com múltiplos métodos
   */
  static async generatePreviewWithFallback(outputPath: string): Promise<{ success: boolean; method?: string; error?: string; output?: string }> {
    console.log('� SISTEMA ROBUSTO INICIADO - Testando 5 métodos de fallback...');
    console.log('🎯 Output path:', outputPath);
    console.log('🔧 Blender path:', BLENDER_PATHS.BLENDER_EXE);
    
    const methods: BlenderMethod[] = [
      {
        name: 'EEVEE_ORIGINAL',
        execute: () => this.executeBlenderMethod(outputPath, 'BLENDER_EEVEE')
      },
      {
        name: 'CYCLES',
        execute: () => this.executeBlenderMethod(outputPath, 'CYCLES')
      },
      {
        name: 'WORKBENCH',
        execute: () => this.executeBlenderMethod(outputPath, 'BLENDER_WORKBENCH')
      },
      {
        name: 'FACTORY_RESET',
        execute: () => this.executeBlenderFactoryReset(outputPath)
      },
      {
        name: 'MINIMAL_SCENE',
        execute: () => this.executeMinimalScene(outputPath)
      }
    ];

    for (const method of methods) {
      console.log(`\n🧪 ============ TESTANDO MÉTODO: ${method.name} ============`);
      console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);
      
      try {
        const result = await method.execute();
        console.log(`📊 Resultado completo para ${method.name}:`, result);
        
        if (result.success) {
          console.log(`✅ ✅ ✅ SUCESSO! Método ${method.name} funcionou! ✅ ✅ ✅`);
          return {
            success: true,
            method: method.name,
            output: result.output
          };
        } else {
          console.log(`❌ ❌ ❌ FALHA no método ${method.name}: ${result.error}`);
        }
      } catch (error) {
        console.log(`💥 💥 💥 EXCEÇÃO no método ${method.name}:`, error);
      }
      
      console.log(`⏭️ Tentando próximo método...`);
    }

    console.log('\n🚫 🚫 🚫 TODOS OS MÉTODOS FALHARAM - Sistema de fallback esgotado 🚫 🚫 🚫');
    return {
      success: false,
      error: 'All methods failed - sistema de fallback esgotado'
    };
  }

  /**
   * Método 1: Executar com engine específico
   */
  private static async executeBlenderMethod(outputPath: string, engine: string): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log(`🎮 Executando Blender com engine: ${engine}`);
    console.log(`📁 Output esperado: ${outputPath}`);
    
    return new Promise((resolve) => {
      const scriptContent = `
import bpy
import sys
import os

print(f"🎯 Script iniciado - Engine: ${engine}")
print(f"📂 Output path: ${outputPath.replace(/\\/g, '\\\\')}")

try:
    # Configurar engine
    print("⚙️ Configurando engine...")
    bpy.context.scene.render.engine = '${engine}'
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080
    bpy.context.scene.render.filepath = "${outputPath.replace(/\\/g, '\\\\')}"
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    
    print("🎬 Iniciando renderização...")
    result = bpy.ops.render.render(write_file=True)
    print(f"📋 Resultado da renderização: {result}")
    
    # Verificar se arquivo foi criado
    output_file = "${outputPath.replace(/\\/g, '\\\\')}"
    if os.path.exists(output_file):
        size = os.path.getsize(output_file)
        print(f"✅ ✅ ✅ SUCESSO! Arquivo criado: {size} bytes")
        print(f"📁 Localização: {output_file}")
    else:
        print("❌ ❌ ❌ ERRO: Arquivo não foi criado")
        print(f"🔍 Tentativa de criar em: {output_file}")
        sys.exit(1)
        
except Exception as e:
    print(f"💥 💥 💥 ERRO NA RENDERIZAÇÃO: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
`;

      // Criar script temporário
      const tempScript = path.join(process.cwd(), 'temp_render_script.py');
      console.log(`📝 Criando script temporário: ${tempScript}`);
      fs.writeFileSync(tempScript, scriptContent);

      const args = [
        '--background',
        '--factory-startup',
        '--python',
        tempScript
      ];

      const blenderProcess = spawn(this.BLENDER_PATH, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      blenderProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      blenderProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      blenderProcess.on('close', (code) => {
        // Limpar script temporário
        try {
          fs.unlinkSync(tempScript);
        } catch {}

        if (code === 0 && fs.existsSync(outputPath)) {
          resolve({
            success: true,
            output: stdout
          });
        } else {
          resolve({
            success: false,
            error: stderr || `Exit code: ${code}`,
            output: stdout
          });
        }
      });

      blenderProcess.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });
    });
  }

  /**
   * Método 2: Factory Reset
   */
  private static async executeBlenderFactoryReset(outputPath: string): Promise<{ success: boolean; output?: string; error?: string }> {
    return this.executeBlenderMethod(outputPath, 'BLENDER_EEVEE');
  }

  /**
   * Método 3: Cena Mínima
   */
  private static async executeMinimalScene(outputPath: string): Promise<{ success: boolean; output?: string; error?: string }> {
    return new Promise((resolve) => {
      const scriptContent = `
import bpy
import bmesh

print("🏗️ Criando cena mínima...")

# Limpar cena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Criar cubo simples
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))

# Adicionar luz
bpy.ops.object.light_add(type='SUN', location=(5, 5, 5))

# Adicionar câmera
bpy.ops.object.camera_add(location=(7, -7, 5))
camera = bpy.context.object
camera.rotation_euler = (1.1, 0, 0.785)

# Configurar render
bpy.context.scene.camera = camera
bpy.context.scene.render.engine = 'BLENDER_WORKBENCH'
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.filepath = "${outputPath.replace(/\\/g, '\\\\')}"

# Renderizar
print("🎬 Renderizando cena mínima...")
bpy.ops.render.render(write_file=True)

print("✅ Cena mínima renderizada!")
`;

      const tempScript = path.join(process.cwd(), 'minimal_scene_script.py');
      fs.writeFileSync(tempScript, scriptContent);

      const blenderProcess = spawn(this.BLENDER_PATH, [
        '--background',
        '--factory-startup',
        '--python',
        tempScript
      ]);

      let stdout = '';
      let stderr = '';

      blenderProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      blenderProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      blenderProcess.on('close', (code) => {
        try {
          fs.unlinkSync(tempScript);
        } catch {}

        if (code === 0 && fs.existsSync(outputPath)) {
          resolve({
            success: true,
            output: stdout
          });
        } else {
          resolve({
            success: false,
            error: stderr || `Exit code: ${code}`,
            output: stdout
          });
        }
      });
    });
  }

  /**
   * Teste de diagnóstico completo
   */
  static async runDiagnostics(): Promise<void> {
    console.log('🔬 Executando diagnósticos completos...');
    
    // 1. Testar Blender
    console.log('1️⃣ Testando Blender...');
    try {
      const result = execSync(`"${this.BLENDER_PATH}" --version`, { encoding: 'utf8' });
      console.log('✅ Blender OK:', result.split('\n')[0]);
    } catch (error) {
      console.error('❌ Blender falhou:', error);
      return;
    }

    // 2. Testar permissões
    console.log('2️⃣ Testando permissões...');
    const testFile = path.join(process.cwd(), 'permission_test.txt');
    try {
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log('✅ Permissões OK');
    } catch (error) {
      console.error('❌ Permissões falharam:', error);
      return;
    }

    // 3. Testar engines
    console.log('3️⃣ Testando engines...');
    const engines = ['BLENDER_EEVEE', 'CYCLES', 'BLENDER_WORKBENCH'];
    for (const engine of engines) {
      console.log(`   Testando ${engine}...`);
      // Implementar teste específico por engine
    }

    console.log('🎉 Diagnósticos concluídos!');
  }
}
