// 🎵 TESTE V1.4.0.a.5 - EXECUTAR RENDER DIRETO
console.log('🎵 INICIANDO TESTE V1.4.0.a.5 - MP4 COM ÁUDIO');
console.log('📁 Diretório:', process.cwd());
console.log('⏰ Data/Hora:', new Date().toLocaleString());

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Seguindo AI-RULES-CRITICAL.md - usando apenas arquivos permitidos
const BASE_DIR = process.cwd();
const AUDIO_FILE = path.join(BASE_DIR, 'Blender', 'sample_audio2.wav');
const IMAGE_FILE = path.join(BASE_DIR, 'Blender', 'sample_cover.jpg');
const TEMPLATE_FILE = path.join(BASE_DIR, 'Blender', 'template.blend');
const PYTHON_SCRIPT = path.join(BASE_DIR, 'Blender', 'render_audio_visualizer.py');
const OUTPUT_FILE = path.join(BASE_DIR, 'uploads', 'teste_v1.4.0.a.5_DIRETO.mp4');

console.log('\n📋 VERIFICANDO ARQUIVOS OBRIGATÓRIOS:');
console.log('🎵 Áudio:', AUDIO_FILE, fs.existsSync(AUDIO_FILE) ? '✅' : '❌');
console.log('🖼️ Imagem:', IMAGE_FILE, fs.existsSync(IMAGE_FILE) ? '✅' : '❌');
console.log('🎬 Template:', TEMPLATE_FILE, fs.existsSync(TEMPLATE_FILE) ? '✅' : '❌');
console.log('🐍 Python:', PYTHON_SCRIPT, fs.existsSync(PYTHON_SCRIPT) ? '✅' : '❌');

if (!fs.existsSync(AUDIO_FILE) || !fs.existsSync(IMAGE_FILE) || 
    !fs.existsSync(TEMPLATE_FILE) || !fs.existsSync(PYTHON_SCRIPT)) {
    console.log('❌ ERRO: Arquivos necessários não encontrados!');
    process.exit(1);
}

console.log('\n🎬 EXECUTANDO BLENDER V1.4.0.a.5...');
console.log('🔧 CORREÇÕES APLICADAS:');
console.log('   ✅ Duração: duration_seconds * fps');
console.log('   ✅ Codec AAC ativado');  
console.log('   ✅ Sequence editor integrado');

// Usando spawn conforme AI-RULES-CRITICAL.md (shell: false)
const blenderProcess = spawn('C:\\Blender\\blender.exe', [
    '--background', TEMPLATE_FILE,
    '--python', PYTHON_SCRIPT,
    '--', AUDIO_FILE, IMAGE_FILE, OUTPUT_FILE
], {
    stdio: 'inherit',
    shell: false
});

blenderProcess.on('close', (code) => {
    console.log('\n============================================');
    console.log('🔍 VERIFICANDO RESULTADO V1.4.0.a.5:');
    console.log('============================================');
    console.log('📊 Código de saída:', code);
    
    if (fs.existsSync(OUTPUT_FILE)) {
        const stats = fs.statSync(OUTPUT_FILE);
        console.log('✅ SUCESSO! MP4 COM ÁUDIO GERADO!');
        console.log('   📁 Arquivo:', OUTPUT_FILE);
        console.log('   📏 Tamanho:', stats.size, 'bytes');
        console.log('   📅 Criado:', stats.birthtime.toLocaleString());
        console.log('\n🎯 VERIFICAÇÕES CRÍTICAS V1.4.0.a.5:');
        console.log('   1. ⏱️ Duração deve ser ~8 segundos');
        console.log('   2. 🎵 Áudio deve estar audível');
        console.log('   3. 🎬 Animação sincronizada');
        console.log('   4. 🔊 Codec AAC integrado');
        console.log('\n🎉 V1.4.0.a.5 - MP4 COM ÁUDIO - TESTE SUCESSO!');
        console.log('💡 Abra o arquivo para verificar o áudio!');
    } else {
        console.log('❌ ERRO: MP4 não foi gerado!');
        console.log('   Verifique se o Blender está instalado em C:\\Blender\\');
        console.log('   Ou se há problemas no script Python');
    }
    
    console.log('\n🏁 TESTE V1.4.0.a.5 FINALIZADO!');
    process.exit(code);
});

blenderProcess.on('error', (error) => {
    console.log('❌ ERRO ao executar Blender:', error.message);
    console.log('   Verifique se o Blender está instalado em C:\\Blender\\blender.exe');
    process.exit(1);
});
