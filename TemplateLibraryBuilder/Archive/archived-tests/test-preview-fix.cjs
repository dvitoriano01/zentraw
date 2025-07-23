#!/usr/bin/env node

/**
 * 🧪 TESTE DO ENDPOINT DE PREVIEW - ZENTRAW V1.4.0.a.2
 * Testa se a correção do BlenderService resolve o problema
 */

const { execSync } = require('child_process');

console.log('🎬 ZENTRAW V1.4.0.a.2 - TESTE DE PREVIEW');
console.log('=====================================');
console.log('📅', new Date().toLocaleString());
console.log('');

console.log('🔧 CORREÇÃO APLICADA:');
console.log('   ❌ Anterior: const blenderService = new BlenderService()');
console.log('   ✅ Corrigido: BlenderService.generatePreview() [método estático]');
console.log('');

console.log('🧪 TESTANDO ENDPOINTS...');

// Teste 1: Health check
try {
  const health = execSync('curl -s http://localhost:5000/health', { encoding: 'utf-8' });
  console.log('✅ Health:', health.includes('status') ? 'OK' : 'FALHOU');
} catch (error) {
  console.log('❌ Health: ERRO');
}

// Teste 2: Blender test  
try {
  const blender = execSync('curl -s http://localhost:5000/api/blender/test', { encoding: 'utf-8' });
  console.log('✅ Blender Test:', blender.includes('success') ? 'OK' : 'FALHOU');
} catch (error) {
  console.log('❌ Blender Test: ERRO');
}

// Teste 3: Preview endpoint (sem arquivos - deve retornar erro esperado)
try {
  const preview = execSync('curl -s -X POST http://localhost:5000/api/blender/preview', { encoding: 'utf-8' });
  console.log('✅ Preview Endpoint:', preview.includes('required') ? 'OK (erro esperado)' : 'RESPOSTA INESPERADA');
  console.log('   📄 Resposta:', preview.substring(0, 100) + '...');
} catch (error) {
  console.log('❌ Preview Endpoint: ERRO DE CONEXÃO');
}

console.log('');
console.log('🎯 RESULTADO ESPERADO:');
console.log('   - Health: OK');
console.log('   - Blender Test: OK'); 
console.log('   - Preview: Erro de "arquivo requerido" (normal sem upload)');
console.log('');
console.log('💡 Se todos passaram, o frontend deve funcionar agora!');
console.log('🚀 Teste no browser: http://localhost:5174');
