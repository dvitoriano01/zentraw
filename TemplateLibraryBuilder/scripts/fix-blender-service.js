#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BlenderServiceFixer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.servicePath = path.join(this.projectRoot, 'server', 'services', 'blender-service.ts');
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      fix: '\x1b[35m'
    };
    console.log(`${colors[type]}${message}\x1b[0m`);
  }

  async fixBlenderService() {
    this.log('🔧 Corrigindo BlenderService para argumentos com espaços...', 'info');

    if (!fs.existsSync(this.servicePath)) {
      this.log(`❌ Arquivo não encontrado: ${this.servicePath}`, 'error');
      return;
    }

    let content = fs.readFileSync(this.servicePath, 'utf8');

    // Fix 1: Corrigir a construção do comando PowerShell
    const oldExecuteBlender = `      // Construir comando PowerShell para lidar com espaços no caminho
      // Escapar argumentos que contêm espaços
      const escapedArgs = args.map(arg => {
        if (arg.includes(' ')) {
          return \`"\${arg}"\`; // Aspas para argumentos com espaços
        }
        return arg;
      });
      
      const powershellCommand = \`& "\${this.BLENDER_PATH}" \${escapedArgs.join(' ')}\`;`;

    const newExecuteBlender = `      // Construir comando PowerShell para lidar com espaços no caminho
      // Escapar TODOS os argumentos para PowerShell
      const escapedArgs = args.map(arg => {
        // Escapar aspas internas e envolver em aspas
        const escaped = arg.replace(/"/g, '\\\\"');
        return \`"\${escaped}"\`;
      });
      
      const powershellCommand = \`& "\${this.BLENDER_PATH}" \${escapedArgs.join(' ')}\`;`;

    if (content.includes('const escapedArgs = args.map(arg => {')) {
      content = content.replace(
        /\/\/ Construir comando PowerShell para lidar com espaços no caminho[\s\S]*?const powershellCommand = `& "\${this\.BLENDER_PATH}" \${escapedArgs\.join\(' '\)}\`;/,
        newExecuteBlender
      );
      this.log('✅ Corrigido método de escape de argumentos', 'fix');
    }

    // Fix 2: Adicionar método de validação de paths
    const validationMethod = `
  /**
   * Valida e corrige paths com espaços para uso no PowerShell
   */
  private static validateAndEscapePath(filePath: string): string {
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(\`File not found: \${filePath}\`);
    }
    
    // Converter para path absoluto
    const absolutePath = path.resolve(filePath);
    
    // Verificar se contém caracteres problemáticos
    if (absolutePath.includes('"')) {
      throw new Error(\`Path contains invalid characters: \${absolutePath}\`);
    }
    
    return absolutePath;
  }`;

    if (!content.includes('validateAndEscapePath')) {
      // Adicionar antes do método executeBlender
      content = content.replace(
        /  \/\*\*\s*\* Executa o Blender/,
        validationMethod + '\n\n  /**\n   * Executa o Blender'
      );
      this.log('✅ Adicionado método de validação de paths', 'fix');
    }

    // Fix 3: Usar validação nos métodos principais
    const renderMethod = content.match(/static async renderAudioVisualizer\([\s\S]*?try \{[\s\S]*?\}/);
    if (renderMethod && !renderMethod[0].includes('validateAndEscapePath')) {
      content = content.replace(
        /\/\/ Validar se os arquivos existem\s*if \(!fs\.existsSync\(options\.audioPath\)\) \{[\s\S]*?\}/,
        `// Validar e escapar caminhos
      options.audioPath = this.validateAndEscapePath(options.audioPath);
      options.imagePath = this.validateAndEscapePath(options.imagePath);
      const validatedTemplatePath = this.validateAndEscapePath(templatePath);`
      );
      this.log('✅ Adicionada validação no método renderAudioVisualizer', 'fix');
    }

    // Fix 4: Corrigir timeout e logging
    const timeoutFix = `      // Timeout mais longo para renders complexos
      const timeout = setTimeout(() => {
        console.log('⏰ Blender process timeout (60s), killing...');
        blenderProcess.kill('SIGTERM');
        hasError = true;
        resolve({ 
          success: false, 
          error: 'Blender process timeout after 60 seconds' 
        });
      }, 60000); // 60 segundos para renders`;

    content = content.replace(
      /\/\/ Timeout para evitar travamento[\s\S]*?}, 30000\); \/\/ 30 segundos/,
      timeoutFix
    );

    // Salvar arquivo corrigido
    fs.writeFileSync(this.servicePath, content);
    this.log('✅ BlenderService corrigido e salvo!', 'success');

    // Criar backup
    const backupPath = `${this.servicePath}.backup.${Date.now()}`;
    fs.writeFileSync(backupPath, fs.readFileSync(this.servicePath, 'utf8'));
    this.log(`📁 Backup criado: ${path.basename(backupPath)}`, 'info');
  }

  async createTestScript() {
    this.log('🧪 Criando script de teste dedicado...', 'info');

    const testScript = `#!/usr/bin/env node

import { BlenderService } from '../server/services/blender-service.js';
import path from 'path';
import fs from 'fs';

async function runBlenderTest() {
  console.log('🎯 Executando teste completo do BlenderService...');
  
  const projectRoot = process.cwd();
  const sampleAudio = path.join(projectRoot, 'Blender', 'sample_audio.wav');
  const sampleImage = path.join(projectRoot, 'Blender', 'sample_cover.jpg');
  const outputPath = path.join(projectRoot, 'Blender', 'test_render_output.mp4');
  
  // Verificar arquivos de entrada
  console.log('📋 Verificando arquivos de entrada...');
  console.log(\`Audio: \${fs.existsSync(sampleAudio) ? '✅' : '❌'} \${sampleAudio}\`);
  console.log(\`Image: \${fs.existsSync(sampleImage) ? '✅' : '❌'} \${sampleImage}\`);
  
  try {
    // Limpar output anterior
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
      console.log('🗑️ Output anterior removido');
    }
    
    // Executar render
    console.log('🎬 Iniciando render de teste...');
    const startTime = Date.now();
    
    const result = await BlenderService.renderAudioVisualizer({
      audioPath: sampleAudio,
      imagePath: sampleImage,
      outputPath: outputPath
    });
    
    const duration = Date.now() - startTime;
    
    if (result.success) {
      console.log(\`✅ Render concluído em \${duration}ms\`);
      console.log(\`📁 Output: \${result.outputPath}\`);
      console.log(\`📊 Tamanho: \${fs.statSync(result.outputPath).size} bytes\`);
    } else {
      console.log(\`❌ Render falhou: \${result.error}\`);
    }
    
  } catch (error) {
    console.error(\`💥 Erro durante teste: \${error.message}\`);
  }
}

runBlenderTest().catch(console.error);`;

    const testPath = path.join(this.projectRoot, 'scripts', 'test-blender-service.js');
    fs.writeFileSync(testPath, testScript);
    this.log(`✅ Script de teste criado: ${path.basename(testPath)}`, 'success');
  }
}

// Executar correções
const fixer = new BlenderServiceFixer();
await fixer.fixBlenderService();
await fixer.createTestScript();

console.log('\n🎉 Todas as correções aplicadas! Execute:');
console.log('   npm run test:blender   # Para testar o serviço');
console.log('   scripts\\run-blender-autofix.bat   # Para diagnóstico completo');
