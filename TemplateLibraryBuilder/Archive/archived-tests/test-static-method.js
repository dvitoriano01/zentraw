// Teste rápido para verificar se o método estático está funcionando
import { BlenderService } from './server/services/blender-service-v2.js';

console.log('Testando método estático...');
console.log('Tipo de BlenderService.generatePreview:', typeof BlenderService.generatePreview);

if (typeof BlenderService.generatePreview === 'function') {
    console.log('✅ Método estático generatePreview existe!');
} else {
    console.log('❌ Método estático generatePreview NÃO existe!');
}

console.log('Métodos disponíveis:', Object.getOwnPropertyNames(BlenderService));
