#!/usr/bin/env node

/**
 * Script de watch para monitorar mudanças nos arquivos de versão
 * e atualizar automaticamente as tasks do VS Code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCurrentVersion, updateTasksJson, updatePackageJson } from './update-version.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos a serem monitorados
const watchFiles = [
  'docs/v1.3.0.c.9/DEVELOPMENT_PLAN.md',
  'docs/v1.3.0.c.9/ZOOM_SYSTEM_PHOTOSHOP.md',
  'client/src/pages/PhotoEditorFixed.tsx',
  'docs/versioning/VERSION_LOG.md'
];

let lastVersion = getCurrentVersion();
console.log(`🔍 Monitorando arquivos de versão...`);
console.log(`📋 Versão atual: ${lastVersion}`);

// Função para verificar mudanças de versão
function checkVersionChange() {
  const currentVersion = getCurrentVersion();
  
  if (currentVersion !== lastVersion) {
    console.log(`🔄 Versão mudou: ${lastVersion} → ${currentVersion}`);
    
    const tasksUpdated = updateTasksJson(currentVersion);
    const packageUpdated = updatePackageJson(currentVersion);
    
    if (tasksUpdated || packageUpdated) {
      console.log('✅ Arquivos atualizados automaticamente!');
    }
    
    lastVersion = currentVersion;
  }
}

// Configura watchers para os arquivos
watchFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(fullPath)) {
    console.log(`👁️ Monitorando: ${file}`);
    
    fs.watchFile(fullPath, { interval: 1000 }, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log(`📝 Arquivo modificado: ${file}`);
        checkVersionChange();
      }
    });
  }
});

// Verifica mudanças periodicamente (fallback)
setInterval(checkVersionChange, 5000);

console.log('🎯 Watch ativo. Pressione Ctrl+C para parar.');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Parando o watch...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Parando o watch...');
  process.exit(0);
});
