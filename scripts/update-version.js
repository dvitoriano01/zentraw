#!/usr/bin/env node

/**
 * Script para atualizar automaticamente o label da task do VS Code
 * baseado na versão atual do projeto Zentraw
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para extrair a versão atual baseada no conteúdo dos arquivos
function getCurrentVersion() {
  const versionSources = [
    // Busca na documentação da versão atual
    'docs/v1.3.0.c.9/DEVELOPMENT_PLAN.md',
    'docs/v1.3.0.c.9/ZOOM_SYSTEM_PHOTOSHOP.md',
    // Busca no código principal
    'client/src/pages/PhotoEditorFixed.tsx',
    // Busca no log de versões
    'docs/versioning/VERSION_LOG.md'
  ];

  for (const source of versionSources) {
    const filePath = path.join(__dirname, '..', source);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Busca por padrões de versão
      const versionPatterns = [
        /v1\.3\.0\.c\.(\d+)/g,
        /version\s*:\s*"?1\.3\.0\.c\.(\d+)"?/gi,
        /Zentraw.*v1\.3\.0\.c\.(\d+)/gi
      ];

      for (const pattern of versionPatterns) {
        const matches = [...content.matchAll(pattern)];
        if (matches.length > 0) {
          // Pega a versão mais alta encontrada
          const versions = matches.map(m => parseInt(m[1]));
          const maxVersion = Math.max(...versions);
          return `v1.3.0.c.${maxVersion}`;
        }
      }
    }
  }

  // Fallback para versão padrão
  return 'v1.3.0.c.9';
}

// Função para atualizar o tasks.json
function updateTasksJson(currentVersion) {
  const tasksPath = path.join(__dirname, '..', '.vscode', 'tasks.json');
  
  if (!fs.existsSync(tasksPath)) {
    console.error('Arquivo tasks.json não encontrado!');
    return false;
  }

  const content = fs.readFileSync(tasksPath, 'utf8');
  
  // Remove comentários do JSON para parsing
  const jsonContent = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  
  let tasks;
  try {
    tasks = JSON.parse(jsonContent);
  } catch (error) {
    console.error('Erro ao fazer parse do tasks.json:', error);
    return false;
  }

  let updated = false;

  // Atualiza os labels das tasks
  tasks.tasks.forEach(task => {
    if (task.label.includes('Build Zentraw')) {
      const newLabel = `Build Zentraw FREEPIK FONTS ROBUSTAS ${currentVersion}`;
      if (task.label !== newLabel) {
        task.label = newLabel;
        updated = true;
      }
    }
    
    if (task.label.includes('Start Zentraw Frontend')) {
      const newLabel = `Start Zentraw Frontend with FREEPIK FONTS ${currentVersion}`;
      if (task.label !== newLabel) {
        task.label = newLabel;
        updated = true;
      }
    }
  });

  if (updated) {
    // Escreve o arquivo com formatação bonita
    const updatedContent = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(tasksPath, updatedContent);
    console.log(`✅ Tasks atualizadas para versão ${currentVersion}`);
    return true;
  } else {
    console.log(`✅ Tasks já estão atualizadas para versão ${currentVersion}`);
    return false;
  }
}

// Função para atualizar o package.json se necessário
function updatePackageJson(currentVersion) {
  const packagePath = path.join(__dirname, '..', 'TemplateLibraryBuilder', 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    return false;
  }

  const content = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(content);

  // Atualiza o name para incluir a versão
  const newName = `zentraw-photo-editor-${currentVersion.replace(/\./g, '-')}`;
  
  if (packageJson.name !== newName) {
    packageJson.name = newName;
    packageJson.version = currentVersion.replace('v', '');
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Package.json atualizado para versão ${currentVersion}`);
    return true;
  }

  return false;
}

// Execução principal
function main() {
  console.log('🔄 Atualizando versão das tasks do VS Code...');
  
  const currentVersion = getCurrentVersion();
  console.log(`📋 Versão atual detectada: ${currentVersion}`);
  
  const tasksUpdated = updateTasksJson(currentVersion);
  const packageUpdated = updatePackageJson(currentVersion);
  
  if (tasksUpdated || packageUpdated) {
    console.log('🎉 Arquivos atualizados com sucesso!');
  } else {
    console.log('✅ Todos os arquivos já estão atualizados.');
  }
}

// Executa se chamado diretamente
main();

export { getCurrentVersion, updateTasksJson, updatePackageJson };
