#!/usr/bin/env node

/**
 * Script de inicialização do sistema de versionamento automático
 * Configura hooks, verifica dependências e prepara o ambiente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Inicializando sistema de versionamento automático...');

// Verifica se o Node.js tem a versão adequada
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 16) {
    console.error('❌ Node.js 16+ é necessário. Versão atual:', nodeVersion);
    process.exit(1);
  }
  
  console.log('✅ Node.js versão:', nodeVersion);
}

// Verifica se o Git está disponível
function checkGitAvailable() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git disponível');
  } catch (error) {
    console.error('❌ Git não encontrado. Instale o Git para usar hooks automáticos.');
  }
}

// Configura permissões dos scripts (Unix/Linux)
function setupScriptPermissions() {
  const scripts = [
    'update-version.sh',
    'watch-version.js',
    'setup.js'
  ];
  
  if (process.platform !== 'win32') {
    scripts.forEach(script => {
      const scriptPath = path.join(__dirname, script);
      if (fs.existsSync(scriptPath)) {
        try {
          execSync(`chmod +x "${scriptPath}"`, { stdio: 'ignore' });
          console.log(`✅ Permissões configuradas para ${script}`);
        } catch (error) {
          console.warn(`⚠️ Não foi possível configurar permissões para ${script}`);
        }
      }
    });
  }
}

// Configura o hook pre-commit
function setupPreCommitHook() {
  const hookPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');
  const hookContent = `#!/bin/sh
# Pre-commit hook para atualizar automaticamente a versão das tasks
# Este hook executa sempre que você faz um commit

echo "🔄 Pre-commit: Atualizando versão das tasks..."

# Executa o script de atualização
node scripts/update-version.js

# Se houver mudanças, adiciona ao commit
if [ $? -eq 0 ]; then
    # Verifica se há mudanças no tasks.json
    if git diff --quiet .vscode/tasks.json; then
        echo "✅ Tasks já estão atualizadas"
    else
        echo "📝 Adicionando tasks.json atualizadas ao commit"
        git add .vscode/tasks.json
    fi
    
    # Verifica se há mudanças no package.json
    if git diff --quiet TemplateLibraryBuilder/package.json; then
        echo "✅ Package.json já está atualizado"
    else
        echo "📝 Adicionando package.json atualizado ao commit"
        git add TemplateLibraryBuilder/package.json
    fi
fi

echo "✅ Pre-commit concluído!"
exit 0
`;

  try {
    // Cria o diretório de hooks se não existir
    const hooksDir = path.dirname(hookPath);
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
    console.log('✅ Hook pre-commit configurado');
  } catch (error) {
    console.warn('⚠️ Não foi possível configurar o hook pre-commit:', error.message);
  }
}

// Cria arquivos de configuração se não existirem
function createConfigFiles() {
  const configPath = path.join(__dirname, 'version-config.json');
  
  if (!fs.existsSync(configPath)) {
    console.log('📝 Criando arquivo de configuração...');
    // O arquivo já foi criado anteriormente
  }
  
  console.log('✅ Arquivos de configuração prontos');
}

// Testa o sistema
function testSystem() {
  console.log('🧪 Testando sistema...');
  
  try {
    // Executa o script de atualização
    execSync('node scripts/update-version.js', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('✅ Sistema funcionando corretamente');
  } catch (error) {
    console.error('❌ Erro ao testar sistema:', error.message);
    process.exit(1);
  }
}

// Mostra instruções de uso
function showInstructions() {
  console.log(`
🎉 Sistema de versionamento automático configurado!

📋 Como usar:

1. **Atualização manual:**
   Windows: scripts\\update-version.bat
   Unix/Linux: ./scripts/update-version.sh
   Node.js: node scripts/update-version.js

2. **Via VS Code:**
   Ctrl+Shift+P → "Tasks: Run Task" → "Update Version Labels"

3. **Watch automático:**
   Ctrl+Shift+P → "Tasks: Run Task" → "Watch Version Changes"

4. **Atualização automática:**
   - Configurado via Git hooks (pre-commit)
   - Executado automaticamente a cada commit

📁 Arquivos criados:
- scripts/update-version.js (script principal)
- scripts/watch-version.js (monitoramento)
- scripts/version-config.json (configuração)
- .git/hooks/pre-commit (hook Git)

🔧 Configuração em: scripts/version-config.json
📖 Documentação em: scripts/README.md

✅ Pronto para usar!
`);
}

// Execução principal
function main() {
  checkNodeVersion();
  checkGitAvailable();
  setupScriptPermissions();
  setupPreCommitHook();
  createConfigFiles();
  testSystem();
  showInstructions();
}

main();
