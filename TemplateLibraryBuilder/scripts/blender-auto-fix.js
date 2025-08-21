#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlenderAutoFix {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.projectRoot = path.resolve(__dirname, '..');
    this.blenderDir = path.join(this.projectRoot, 'Blender');
    this.blenderExe = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      warn: '\x1b[33m',    // Yellow
      error: '\x1b[31m',   // Red
      success: '\x1b[32m', // Green
      fix: '\x1b[35m'      // Magenta
    };
    console.log(`${colors[type]}[${timestamp}] ${message}\x1b[0m`);
  }

  async runDiagnostics() {
    this.log('🔍 Iniciando diagnóstico completo do sistema Blender...', 'info');
    
    // 1. Verificar estrutura de diretórios
    await this.checkDirectoryStructure();
    
    // 2. Verificar arquivos de sample
    await this.checkSampleFiles();
    
    // 3. Verificar instalação do Blender
    await this.checkBlenderInstallation();
    
    // 4. Verificar scripts Python
    await this.checkPythonScripts();
    
    // 5. Verificar template.blend
    await this.checkBlenderTemplate();
    
    // 6. Testar execução com argumentos
    await this.testBlenderExecution();
    
    // Relatório final
    this.generateReport();
  }

  async checkDirectoryStructure() {
    this.log('📁 Verificando estrutura de diretórios...', 'info');
    
    const requiredDirs = [
      this.blenderDir,
      path.join(this.blenderDir, 'samples'),
      path.join(this.projectRoot, 'uploads', 'blender'),
      path.join(this.projectRoot, 'server', 'services')
    ];

    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        this.issues.push(`❌ Diretório ausente: ${dir}`);
        // Auto-fix: Criar diretório
        try {
          fs.mkdirSync(dir, { recursive: true });
          this.fixes.push(`✅ Criado diretório: ${dir}`);
          this.log(`Criado diretório: ${dir}`, 'fix');
        } catch (error) {
          this.log(`Erro ao criar diretório ${dir}: ${error.message}`, 'error');
        }
      } else {
        this.log(`✅ Diretório OK: ${dir}`, 'success');
      }
    }
  }

  async checkSampleFiles() {
    this.log('🎵 Verificando arquivos de sample...', 'info');
    
    const sampleFiles = [
      {
        name: 'sample_audio.wav',
        path: path.join(this.blenderDir, 'sample_audio.wav'),
        type: 'audio'
      },
      {
        name: 'sample_cover.jpg',
        path: path.join(this.blenderDir, 'sample_cover.jpg'),
        type: 'image'
      }
    ];

    for (const file of sampleFiles) {
      if (!fs.existsSync(file.path)) {
        this.issues.push(`❌ Arquivo sample ausente: ${file.name}`);
        // Auto-fix: Criar arquivo de sample
        await this.createSampleFile(file);
      } else {
        this.log(`✅ Sample OK: ${file.name}`, 'success');
      }
    }
  }

  async createSampleFile(file) {
    try {
      if (file.type === 'audio') {
        // Criar um arquivo de áudio de teste (wav vazio válido)
        const wavHeader = Buffer.from([
          0x52, 0x49, 0x46, 0x46, // "RIFF"
          0x24, 0x00, 0x00, 0x00, // File size
          0x57, 0x41, 0x56, 0x45, // "WAVE"
          0x66, 0x6D, 0x74, 0x20, // "fmt "
          0x10, 0x00, 0x00, 0x00, // Chunk size
          0x01, 0x00, 0x02, 0x00, // Audio format, channels
          0x44, 0xAC, 0x00, 0x00, // Sample rate (44100)
          0x10, 0xB1, 0x02, 0x00, // Byte rate
          0x04, 0x00, 0x10, 0x00, // Block align, bits per sample
          0x64, 0x61, 0x74, 0x61, // "data"
          0x00, 0x00, 0x00, 0x00  // Data size
        ]);
        fs.writeFileSync(file.path, wavHeader);
        this.fixes.push(`✅ Criado arquivo de áudio sample: ${file.name}`);
      } else if (file.type === 'image') {
        // Criar uma imagem simples 1x1 pixel em formato JPEG
        const jpegHeader = Buffer.from([
          0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
          0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
          0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
          0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
          0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
          0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
          0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
          0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
          0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
          0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
          0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
          0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x9F, 0xFF, 0xD9
        ]);
        fs.writeFileSync(file.path, jpegHeader);
        this.fixes.push(`✅ Criado arquivo de imagem sample: ${file.name}`);
      }
      this.log(`Criado arquivo sample: ${file.name}`, 'fix');
    } catch (error) {
      this.log(`Erro ao criar arquivo sample ${file.name}: ${error.message}`, 'error');
    }
  }

  async checkBlenderInstallation() {
    this.log('🔧 Verificando instalação do Blender...', 'info');
    
    if (!fs.existsSync(this.blenderExe)) {
      this.issues.push(`❌ Blender não encontrado: ${this.blenderExe}`);
      this.log('Blender não encontrado no caminho padrão', 'error');
      return;
    }

    // Testar execução do Blender
    try {
      const result = await this.executeCommand(`"${this.blenderExe}" --version`);
      if (result.success) {
        this.log('✅ Blender instalado e funcionando', 'success');
        this.log(`Versão: ${result.output.split('\n')[0]}`, 'info');
      } else {
        this.issues.push(`❌ Blender não responde: ${result.error}`);
      }
    } catch (error) {
      this.issues.push(`❌ Erro ao testar Blender: ${error.message}`);
    }
  }

  async checkPythonScripts() {
    this.log('🐍 Verificando scripts Python...', 'info');
    
    const scripts = [
      'render_audio_visualizer.py',
      'preview_script.py'
    ];

    for (const script of scripts) {
      const scriptPath = path.join(this.blenderDir, script);
      if (!fs.existsSync(scriptPath)) {
        this.issues.push(`❌ Script Python ausente: ${script}`);
        // Auto-fix: Criar script básico
        await this.createBasicPythonScript(script);
      } else {
        this.log(`✅ Script OK: ${script}`, 'success');
      }
    }
  }

  async createBasicPythonScript(scriptName) {
    const scriptPath = path.join(this.blenderDir, scriptName);
    
    let scriptContent = '';
    if (scriptName === 'render_audio_visualizer.py') {
      scriptContent = `import bpy
import sys
import os

# Obter argumentos da linha de comando
args = sys.argv[sys.argv.index("--") + 1:]

if len(args) < 3:
    print("Erro: Argumentos insuficientes")
    sys.exit(1)

audio_path = args[0]
image_path = args[1]
output_path = args[2]

print(f"Audio: {audio_path}")
print(f"Image: {image_path}")
print(f"Output: {output_path}")

# Configurar renderização
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.ffmpeg.codec = 'H264'

# Renderizar animação
bpy.ops.render.render(animation=True)
print("Renderização concluída!")
`;
    } else if (scriptName === 'preview_script.py') {
      scriptContent = `import bpy
import sys

# Obter argumentos da linha de comando
args = sys.argv[sys.argv.index("--") + 1:]

if len(args) < 1:
    print("Erro: Caminho de output não fornecido")
    sys.exit(1)

output_path = args[0]

# Configurar renderização de imagem
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'PNG'

# Renderizar frame atual
bpy.ops.render.render(write_still=True)
print(f"Preview gerado: {output_path}")
`;
    }

    try {
      fs.writeFileSync(scriptPath, scriptContent);
      this.fixes.push(`✅ Criado script Python: ${scriptName}`);
      this.log(`Criado script Python: ${scriptName}`, 'fix');
    } catch (error) {
      this.log(`Erro ao criar script ${scriptName}: ${error.message}`, 'error');
    }
  }

  async checkBlenderTemplate() {
    this.log('🎨 Verificando template.blend...', 'info');
    
    const templatePath = path.join(this.blenderDir, 'template.blend');
    if (!fs.existsSync(templatePath)) {
      this.issues.push(`❌ Template ausente: template.blend`);
      this.log('Template.blend não encontrado', 'warn');
      // Auto-fix: Criar template básico
      await this.createBasicTemplate();
    } else {
      this.log('✅ Template OK: template.blend', 'success');
    }
  }

  async createBasicTemplate() {
    this.log('🔧 Criando template básico...', 'info');
    
    const templatePath = path.join(this.blenderDir, 'template.blend');
    const createTemplateScript = `
import bpy
import bmesh

# Limpar cena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Criar cubo básico
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "AudioVisualizerCube"

# Adicionar material
mat = bpy.data.materials.new(name="AudioMaterial")
mat.use_nodes = True
cube.data.materials.append(mat)

# Configurar camera
bpy.ops.object.camera_add(location=(7, -7, 5))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0.785)

# Configurar luz
bpy.ops.object.light_add(type='SUN', location=(4, 4, 10))

# Configurar animação (120 frames)
bpy.context.scene.frame_end = 120

# Salvar template
bpy.ops.wm.save_as_mainfile(filepath="${templatePath.replace(/\\/g, '/')}")
print("Template básico criado!")
`;

    const scriptPath = path.join(this.blenderDir, 'create_template.py');
    
    try {
      fs.writeFileSync(scriptPath, createTemplateScript);
      
      // Executar script para criar template
      const result = await this.executeCommand(`"${this.blenderExe}" --background --python "${scriptPath}"`);
      
      if (result.success) {
        this.fixes.push(`✅ Template básico criado: template.blend`);
        this.log('Template básico criado com sucesso', 'fix');
        // Remover script temporário
        fs.unlinkSync(scriptPath);
      } else {
        this.log(`Erro ao criar template: ${result.error}`, 'error');
      }
    } catch (error) {
      this.log(`Erro ao criar template: ${error.message}`, 'error');
    }
  }

  async testBlenderExecution() {
    this.log('🎯 Testando execução do Blender com argumentos...', 'info');
    
    const sampleAudio = path.join(this.blenderDir, 'sample_audio.wav');
    const sampleImage = path.join(this.blenderDir, 'sample_cover.jpg');
    const templatePath = path.join(this.blenderDir, 'template.blend');
    const outputPath = path.join(this.blenderDir, 'test_output.mp4');
    const scriptPath = path.join(this.blenderDir, 'render_audio_visualizer.py');

    // Verificar se todos os arquivos existem
    const requiredFiles = [sampleAudio, sampleImage, templatePath, scriptPath];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        this.issues.push(`❌ Arquivo necessário ausente: ${path.basename(file)}`);
        return;
      }
    }

    // Construir comando com argumentos escapados
    const args = [
      '--background',
      `"${templatePath}"`,
      '--python',
      `"${scriptPath}"`,
      '--',
      `"${sampleAudio}"`,
      `"${sampleImage}"`,
      `"${outputPath}"`
    ];

    const command = `"${this.blenderExe}" ${args.join(' ')}`;
    
    try {
      this.log('Executando teste de render...', 'info');
      const result = await this.executeCommand(command, 15000); // 15 segundos timeout
      
      if (result.success) {
        this.log('✅ Teste de execução bem-sucedido', 'success');
        if (fs.existsSync(outputPath)) {
          this.log('✅ Arquivo de output gerado', 'success');
        } else {
          this.issues.push(`❌ Arquivo de output não foi gerado`);
        }
      } else {
        this.issues.push(`❌ Teste de execução falhou: ${result.error}`);
      }
    } catch (error) {
      this.issues.push(`❌ Erro no teste de execução: ${error.message}`);
    }
  }

  async executeCommand(command, timeout = 10000) {
    return new Promise((resolve) => {
      const process = spawn('powershell', ['-Command', command], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';
      let hasError = false;

      const timer = setTimeout(() => {
        process.kill();
        hasError = true;
        resolve({ success: false, error: 'Timeout' });
      }, timeout);

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        clearTimeout(timer);
        if (hasError) return;
        
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr || `Exit code: ${code}`
        });
      });

      process.on('error', (error) => {
        clearTimeout(timer);
        if (hasError) return;
        resolve({ success: false, error: error.message });
      });
    });
  }

  generateReport() {
    this.log('\n' + '='.repeat(60), 'info');
    this.log('📊 RELATÓRIO DE DIAGNÓSTICO E CORREÇÃO', 'info');
    this.log('='.repeat(60), 'info');
    
    if (this.issues.length === 0) {
      this.log('🎉 Nenhum problema encontrado! Sistema OK.', 'success');
    } else {
      this.log(`❌ Problemas encontrados: ${this.issues.length}`, 'error');
      this.issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (this.fixes.length > 0) {
      this.log(`\n🔧 Correções aplicadas: ${this.fixes.length}`, 'fix');
      this.fixes.forEach(fix => console.log(`   ${fix}`));
    }
    
    this.log('\n' + '='.repeat(60), 'info');
    
    // Salvar relatório
    const reportPath = path.join(this.projectRoot, 'blender-diagnostic-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      issues: this.issues,
      fixes: this.fixes,
      status: this.issues.length === 0 ? 'OK' : 'ISSUES_FOUND'
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`📄 Relatório salvo em: ${reportPath}`, 'info');
  }
}

// Executar diagnóstico
const autoFix = new BlenderAutoFix();
autoFix.runDiagnostics().catch(console.error);
