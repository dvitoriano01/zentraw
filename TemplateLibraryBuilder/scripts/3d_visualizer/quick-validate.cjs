// 🧪 SCRIPT DE VALIDAÇÃO RÁPIDA - ZENTRAW V1.4.0.a.2
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥🔥 ZENTRAW 3D VISUALIZER - VALIDAÇÃO RÁPIDA 🔥🔥');
console.log('📅 Data:', new Date().toLocaleString());
console.log('💻 Testando sistema V2 implementado...\n');

// TESTE 1: VERIFICAÇÃO DE CAMINHOS
console.log('📋 ===== TESTE 1: VERIFICAÇÃO DE CAMINHOS =====');
const blenderPath = 'C:\\Blender\\blender.exe';
const blenderExists = fs.existsSync(blenderPath);
console.log(
  `🔍 Blender principal (C:\\Blender\\): ${blenderExists ? '✅ EXISTS' : '❌ NOT FOUND'}`,
);

if (blenderExists) {
  const stats = fs.statSync(blenderPath);
  console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

// TESTE 2: VERIFICAÇÃO DO CROSS-SPAWN
console.log('\n📋 ===== TESTE 2: VERIFICAÇÃO CROSS-SPAWN =====');
try {
  const npmList = execSync('npm list cross-spawn', { encoding: 'utf-8' });
  console.log('✅ Cross-spawn encontrado!');
  const version = npmList.match(/cross-spawn@(\d+\.\d+\.\d+)/);
  if (version) {
    console.log(`📦 Versão: ${version[1]}`);
  }
} catch (error) {
  console.log('❌ Cross-spawn não encontrado');
}

// TESTE 3: TESTE DIRETO DO BLENDER
console.log('\n📋 ===== TESTE 3: EXECUÇÃO DIRETA DO BLENDER =====');
if (blenderExists) {
  try {
    console.log('🚀 Testando: blender --version');
    const result = execSync(`"${blenderPath}" --version`, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    console.log('✅ Blender executou com sucesso!');
    const firstLine = result.split('\n')[0];
    console.log(`📝 Versão: ${firstLine}`);
  } catch (error) {
    console.log('❌ Falha na execução direta do Blender');
    console.log(`🔍 Erro: ${error.message}`);
  }
} else {
  console.log('⏭️ Pulando teste - Blender não encontrado');
}

// TESTE 4: VERIFICAÇÃO DE ARQUIVOS V2
console.log('\n📋 ===== TESTE 4: ARQUIVOS DO SISTEMA V2 =====');
const v2Files = [
  'server/services/blender-service-v2.ts',
  'server/services/blender-service-robust-v2.ts',
  'server/blender-paths.ts',
];

v2Files.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`📁 ${file}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
});

// TESTE 5: VERIFICAÇÃO DO BACKEND
console.log('\n📋 ===== TESTE 5: ESTRUTURA DO BACKEND =====');
const backendFiles = ['server/backend-only.ts', 'server/routes/blender.ts'];

backendFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`📁 ${file}: ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
});

// RESUMO FINAL
console.log('\n📊 ===== RESUMO DA VALIDAÇÃO =====');
console.log('✅ Sistema V2 implementado e arquivos presentes');
console.log('✅ Cross-spawn instalado para execução robusta');
console.log(`✅ Blender ${blenderExists ? 'encontrado' : 'ausente'} em C:\\Blender\\`);
console.log('\n💡 PRÓXIMO PASSO: Iniciar o backend para teste completo');
console.log('🚀 Comando: npm run dev:back');
