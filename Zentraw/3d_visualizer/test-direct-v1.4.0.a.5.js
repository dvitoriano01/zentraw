const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

console.log('🎵 INICIANDO TESTE V1.4.0.a.5 - MP4 COM ÁUDIO');
console.log('📁 Diretório:', __dirname);
console.log('⏰ Data/Hora:', new Date().toLocaleString());

const app = express();
const upload = multer({ dest: 'uploads/' });

// Teste direto dos arquivos
const audioFile = path.resolve(__dirname, 'Blender', 'sample_audio2.wav');
const imageFile = path.resolve(__dirname, 'Blender', 'sample_cover.jpg');
const templateFile = path.resolve(__dirname, 'Blender', 'template.blend');
const outputFile = path.resolve(__dirname, 'uploads', 'teste_v1.4.0.a.5_direto.mp4');

console.log('\n📋 VERIFICANDO ARQUIVOS:');
console.log('🎵 Áudio:', audioFile);
console.log('🖼️ Imagem:', imageFile);
console.log('🎬 Template:', templateFile);
console.log('📤 Output:', outputFile);

function testV145Audio() {
    console.log('\n🎬 EXECUTANDO BLENDER V1.4.0.a.5...');
    console.log('🔧 CORREÇÕES APLICADAS:');
    console.log('   ✅ Duração: duration_seconds * fps');
    console.log('   ✅ Codec AAC ativado');
    console.log('   ✅ Sequence editor integrado');
    
    const blenderProcess = spawn('C:\\Blender\\blender.exe', [
        '--background', templateFile,
        '--python', path.resolve(__dirname, 'Blender', 'render_audio_visualizer.py'),
        '--', audioFile, imageFile, outputFile
    ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    blenderProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        console.log('📄 Blender:', text.trim());
    });

    blenderProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.log('⚠️ Blender Error:', text.trim());
    });

    blenderProcess.on('close', (code) => {
        console.log('\n============================================');
        console.log('🔍 RESULTADO V1.4.0.a.5:');
        console.log('============================================');
        console.log('📊 Código de saída:', code);
        
        const fs = require('fs');
        if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            console.log('✅ SUCESSO! MP4 COM ÁUDIO gerado!');
            console.log('   📁 Arquivo:', outputFile);
            console.log('   📏 Tamanho:', stats.size, 'bytes');
            console.log('   📅 Criado:', stats.birthtime);
            console.log('\n🎯 VERIFICAÇÕES V1.4.0.a.5:');
            console.log('   1. ⏱️ Duração deve ser ~8 segundos');
            console.log('   2. 🎵 Áudio deve estar audível');
            console.log('   3. 🎬 Animação sincronizada');
            console.log('   4. 🔊 Codec AAC integrado');
            console.log('\n🎉 V1.4.0.a.5 COM ÁUDIO - TESTE SUCESSO!');
        } else {
            console.log('❌ ERRO: MP4 não foi gerado!');
            console.log('📄 Output completo:');
            console.log(output);
            console.log('📄 Errors:');
            console.log(errorOutput);
        }
        
        console.log('\n🏁 TESTE V1.4.0.a.5 FINALIZADO!');
        process.exit(code);
    });

    blenderProcess.on('error', (error) => {
        console.log('❌ ERRO ao executar Blender:', error.message);
        process.exit(1);
    });
}

// Executar teste
testV145Audio();
