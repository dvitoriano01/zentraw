#!/usr/bin/env node

/**
 * 🩺 ZENTRAW AGENT - HEALTH CHECK AUTOMÁTICO
 * Diagnóstico completo do sistema antes da inicialização
 * Data: 21/08/2025 - Criado após resolução de problemas WSL
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🩺 ZENTRAW HEALTH CHECK INICIADO');
console.log('================================');

// 1. Verificar porta 3007
try {
  const portCheck = execSync('lsof -ti:3007', { encoding: 'utf8' });
  if (portCheck.trim()) {
    console.log('❌ PORTA 3007 OCUPADA - PID:', portCheck.trim());
    console.log('💡 Solução: kill -9', portCheck.trim());
    process.exit(1);
  } else {
    console.log('✅ PORTA 3007 LIVRE');
  }
} catch (error) {
  console.log('✅ PORTA 3007 LIVRE');
}

// 2. Verificar dependências
try {
  execSync('npm list openai', { encoding: 'utf8' });
  console.log('✅ OPENAI MODULE INSTALADO');
} catch (error) {
  console.log('❌ OPENAI MODULE AUSENTE');
  console.log('💡 Solução: npm install openai');
  process.exit(1);
}

// 3. Verificar sintaxe do servidor
try {
  execSync('node --check src/server.js', { encoding: 'utf8' });
  console.log('✅ SINTAXE DO SERVIDOR VÁLIDA');
} catch (error) {
  console.log('❌ ERRO DE SINTAXE NO SERVIDOR');
  console.log('💡 Solução: Verificar src/server.js');
  process.exit(1);
}

// 4. Verificar arquivo .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('OPENAI_API_KEY')) {
    console.log('✅ ARQUIVO .ENV CONFIGURADO');
  } else {
    console.log('❌ OPENAI_API_KEY AUSENTE NO .ENV');
    process.exit(1);
  }
} else {
  console.log('❌ ARQUIVO .ENV NÃO ENCONTRADO');
  process.exit(1);
}

// 5. Verificar ambiente WSL
try {
  const unameResult = execSync('uname -a', { encoding: 'utf8' });
  if (unameResult.includes('microsoft') || unameResult.includes('WSL')) {
    console.log('✅ AMBIENTE WSL DETECTADO');
  } else {
    console.log('⚠️ AMBIENTE NÃO-WSL DETECTADO');
  }
} catch (error) {
  console.log('⚠️ NÃO FOI POSSÍVEL DETECTAR AMBIENTE');
}

console.log('================================');
console.log('🎯 SISTEMA PRONTO PARA INICIALIZAÇÃO');
console.log('🚀 Execute: node src/server.js');
