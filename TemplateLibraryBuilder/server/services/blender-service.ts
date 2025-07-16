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

  /**
   * Gera um preview de um único frame com o template completo (áudio + imagem + configurações)
   */
  async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    const timestamp = Date.now();
    const outputPath = path.join(process.cwd(), 'uploads', 'blender', `preview_${timestamp}.png`);
    const templatePath = BlenderService.DEFAULT_TEMPLATE;

    try {
      // Validar se os arquivos existem
      if (!fs.existsSync(options.audioFile)) {
        throw new Error(`Audio file not found: ${options.audioFile}`);
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
          '--python-expr',
          `
import bpy
import bmesh
import sys
import os
import numpy as np

# Configurar engine de render
if '${options.renderEngine}' == 'cycles':
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'GPU'
    print("🎯 Using Cycles GPU engine")
else:
    bpy.context.scene.render.engine = 'BLENDER_EEVEE'
    print("⚡ Using Eevee engine")

# Configurar resolução para preview
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.resolution_percentage = 75  # 75% para preview de boa qualidade

# Configurar câmera baseado nos parâmetros (0-100%)
camera = bpy.data.objects.get('Camera')
if camera:
    print(f"📷 Configuring camera position...")
    # Distância: 0% = próximo, 50% = original, 100% = longe
    distance_factor = ${options.cameraSettings.distance} / 50.0  # Normalizar para 0-2
    original_location = camera.location.copy()
    camera.location.z = original_location.z * distance_factor
    
    # Altura: 0% = baixo, 50% = original, 100% = alto  
    height_factor = ${options.cameraSettings.height} / 50.0
    camera.location.y = original_location.y * height_factor
    
    # Ângulo: 0% = esquerda, 50% = original, 100% = direita
    angle_offset = (${options.cameraSettings.angle} - 50) * 0.02  # -1 a +1 radianos
    camera.rotation_euler.z = angle_offset
    print(f"📷 Camera positioned: distance={distance_factor:.2f}, height={height_factor:.2f}, angle={angle_offset:.2f}")

# Carregar e aplicar imagem de background/material
try:
    # Procurar por material ou plano para aplicar a imagem
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and 'background' in obj.name.lower():
            # Aplicar imagem como material
            if obj.data.materials:
                mat = obj.data.materials[0]
                if mat.use_nodes:
                    # Carregar imagem
                    img = bpy.data.images.load('${options.imageFile.replace(/\\/g, '/')}')
                    
                    # Configurar nós do material
                    nodes = mat.node_tree.nodes
                    tex_node = None
                    for node in nodes:
                        if node.type == 'TEX_IMAGE':
                            tex_node = node
                            break
                    
                    if tex_node:
                        tex_node.image = img
                        print(f"🖼️ Background image applied to {obj.name}")
                    break
    print(f"✅ Image loaded: ${options.imageFile}")
except Exception as e:
    print(f"⚠️ Could not load image: {e}")

# Configurar animação baseada no estilo
animation_style = '${options.animationStyle}'
sensitivity = ${options.sensitivity} / 100.0  # Normalizar para 0-1
smoothing = ${options.smoothing} / 100.0      # Normalizar para 0-1

# Procurar objeto principal para animar (cubo, esfera, etc.)
main_object = None
for obj in bpy.data.objects:
    if obj.type == 'MESH' and obj.name.lower() in ['cube', 'sphere', 'bars', 'visualizer']:
        main_object = obj
        break

if main_object:
    print(f"🎯 Found main object: {main_object.name}")
    
    # Simular animação baseada no áudio (para preview, usar valor médio)
    # Em um preview, simulamos o efeito visual sem processar o áudio completo
    if animation_style == 'cube':
        # Simular escala do cubo baseado na "intensidade média" do áudio
        scale_factor = 1.0 + (sensitivity * 0.5)  # Entre 1.0 e 1.5
        main_object.scale = (scale_factor, scale_factor, scale_factor)
        print(f"📦 Cube scaled to: {scale_factor:.2f}")
        
    elif animation_style == 'sphere':
        # Simular deformação da esfera
        scale_factor = 1.0 + (sensitivity * 0.3)
        main_object.scale = (scale_factor, scale_factor, 1.0 + (sensitivity * 0.1))
        print(f"🔮 Sphere scaled to: {scale_factor:.2f}")
        
    elif animation_style == 'bars':
        # Para barras, simular diferentes alturas
        if hasattr(main_object, 'modifiers'):
            for mod in main_object.modifiers:
                if mod.type == 'ARRAY':
                    # Ajustar array de barras
                    pass
        print(f"📊 Bars animation style applied")

# Configurar iluminação para melhor preview
for light in bpy.data.objects:
    if light.type == 'LIGHT':
        light.data.energy *= (1.0 + sensitivity * 0.5)  # Aumentar intensidade baseado na sensibilidade

# Configurar output
bpy.context.scene.render.filepath = '${outputPath.replace(/\\/g, '/')}'
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.context.scene.render.image_settings.quality = 90

# Render frame médio para preview (frame 60 de 120, por exemplo)
bpy.context.scene.frame_set(60)
print(f"🎬 Rendering preview frame...")
bpy.ops.render.render(write_still=True)

print(f'✅ Complete template preview rendered to: ${outputPath}')
          `
        ];

        const blenderProcess = spawn(BlenderService.BLENDER_PATH, args);

        let output = '';
        let errorOutput = '';

        blenderProcess.stdout.on('data', (data) => {
          output += data.toString();
          console.log(`[Blender Preview] ${data.toString().trim()}`);
        });

        blenderProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`[Blender Preview Error] ${data.toString().trim()}`);
        });

        blenderProcess.on('close', (code) => {
          const renderTime = Date.now() - startTime;
          
          if (code === 0 && fs.existsSync(outputPath)) {
            console.log(`✅ Complete template preview generated successfully in ${renderTime}ms`);
            resolve({
              success: true,
              previewPath: outputPath,
              renderTime
            });
          } else {
            console.error(`❌ Preview generation failed with code ${code}`);
            resolve({
              success: false,
              error: `Blender process failed with code ${code}. Error: ${errorOutput}`,
              renderTime
            });
          }
        });

        blenderProcess.on('error', (error) => {
          console.error('❌ Preview process error:', error);
          resolve({
            success: false,
            error: `Failed to start Blender process: ${error.message}`
          });
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
