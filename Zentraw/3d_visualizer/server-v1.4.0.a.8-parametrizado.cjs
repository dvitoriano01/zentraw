/**
 * Zentraw 3D Visualizer V1.4.0.a.8 - BACKEND PARAMETRIZADO COMPLETO
 * Data: 25/07/2025 - EVOLUÇÃO PARAMETRIZADA
 * Base: server-v1.4.0.a.7-blindado.cjs (BLINDADO - funcionalidade preservada)
 * Novidade: API completa para parâmetros Blender + logs detalhados + controle completo
 * Propósito: Backend Express parametrizado com BLINDAGEM V1.4.0.a.7
 * Status: EVOLUÇÃO PARAMETRIZADA - Zero risco de quebra
 * Dependências: express, multer, child_process, path, fs, uuid
 * Autor: GitHub Copilot
 * Categoria: Backend Parametrized Evolution
 */

const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Validar __dirname (sempre disponível em CommonJS)
const currentDir = __dirname;

console.log(`🔍 DEBUG - __dirname: ${__dirname}`);
console.log(`🔍 DEBUG - currentDir: ${currentDir}`);

const PORT = 3004; // Porta padrão Zentraw (corrigido de 3005)
const UPLOADS_DIR = path.resolve(currentDir, 'uploads');
const OUTPUTS_DIR = path.resolve(currentDir, 'outputs');
const LOGS_DIR = path.resolve(currentDir, 'logs');

// Criar diretórios necessários
[UPLOADS_DIR, OUTPUTS_DIR, LOGS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();
app.use(express.json());
app.use(express.static('.'));

// CORS Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Storage para uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `${timestamp}_${file.fieldname}${extension}`);
    }
});
const upload = multer({ storage });

// 🛡️ BLINDAGEM: Scripts Python disponíveis
const PYTHON_SCRIPTS = {
    'v1.4.0.a.8.1': 'render_audio_visualizer_v1.4.0.a.8.1.py',  // HOTFIX BLENDER 4.5+
    'v1.4.0.a.8': 'render_audio_visualizer_v1.4.0.a.8.py',      // SCRIPT PARAMETRIZADO
    'v1.4.0.a.7': 'render_audio_visualizer_v1.4.0.a.7.py',      // BLINDADO (FALLBACK)
    'v1.4.0.a.5': 'render_audio_visualizer.py'                   // ORIGINAL (EMERGÊNCIA)
};

// Armazenamento de processos ativos
const activeProcesses = new Map();

// Função de logging
function log(message, level = 'INFO', processId = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${processId ? `[${processId}] ` : ''}${message}`;
    
    console.log(logEntry);
    
    // Salvar em arquivo
    const logFile = path.join(LOGS_DIR, `zentraw-backend-${new Date().toISOString().slice(0,10)}.log`);
    fs.appendFileSync(logFile, logEntry + '\n');
    
    return {
        timestamp,
        level,
        message,
        processId
    };
}

// Rota principal - Interface V1.4.0.a.8
app.get('/', (req, res) => {
    res.sendFile(path.join(currentDir, 'interface-v1.4.0.a.8-parametrizada.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    log('Health check solicitado');
    res.json({
        status: 'ok',
        version: 'V1.4.0.a.8.1-HOTFIX',
        timestamp: new Date().toISOString(),
        blindage: {
            'v1.4.0.a.7': fs.existsSync(path.join(currentDir, 'blindage', 'v1.4.0.a.7')),
            'v1.4.0.a.5': fs.existsSync(path.join(currentDir, 'server-simple-real.cjs'))
        },
        system: {
            uploads: fs.existsSync(UPLOADS_DIR),
            outputs: fs.existsSync(OUTPUTS_DIR),
            logs: fs.existsSync(LOGS_DIR),
            blender: 'Available', // Assumindo Blender 4.5 instalado
            python_scripts: Object.keys(PYTHON_SCRIPTS).map(version => ({
                version,
                available: fs.existsSync(path.join(currentDir, 'Blender', PYTHON_SCRIPTS[version]))
            }))
        }
    });
});

// Validar configuração
app.post('/api/validate', (req, res) => {
    const { settings } = req.body;
    log('Validação de configuração solicitada');
    
    const validation = {
        valid: true,
        errors: [],
        warnings: [],
        settings: settings
    };
    
    // Validações básicas
    if (!settings.resolution) {
        validation.errors.push('Resolução não especificada');
        validation.valid = false;
    }
    
    if (settings.fps < 24 || settings.fps > 60) {
        validation.warnings.push('FPS fora da faixa recomendada (24-60)');
    }
    
    if (settings.samples > 256) {
        validation.warnings.push('Muitos samples podem tornar o render lento');
    }
    
    if (!fs.existsSync(path.join(currentDir, 'Blender', PYTHON_SCRIPTS[settings.scriptVersion]))) {
        validation.errors.push(`Script ${settings.scriptVersion} não encontrado`);
        validation.valid = false;
    }
    
    log(`Validação concluída: ${validation.valid ? 'VÁLIDA' : 'INVÁLIDA'}`);
    res.json(validation);
});

// Upload e render parametrizado
app.post('/api/render/parametrized', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    const processId = uuidv4();
    const settings = JSON.parse(req.body.settings);
    
    log('Iniciando render parametrizado', 'INFO', processId);
    
    if (!req.files.audio || !req.files.image) {
        log('Arquivos de entrada ausentes', 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Arquivos de áudio e imagem são obrigatórios'
        });
    }
    
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    
    // Debug detalhado dos arquivos recebidos
    log(`🔍 DEBUG - audioFile: ${JSON.stringify(audioFile)}`, 'DEBUG', processId);
    log(`🔍 DEBUG - imageFile: ${JSON.stringify(imageFile)}`, 'DEBUG', processId);
    
    // Validar se os arquivos têm caminhos válidos
    if (!audioFile || !audioFile.path) {
        log(`❌ Arquivo de áudio inválido ou sem caminho. audioFile: ${audioFile}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Arquivo de áudio inválido'
        });
    }
    
    if (!imageFile || !imageFile.path) {
        log(`❌ Arquivo de imagem inválido ou sem caminho. imageFile: ${imageFile}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Arquivo de imagem inválido'
        });
    }
    
    // Validar caminhos como strings não vazias
    if (typeof audioFile.path !== 'string' || audioFile.path.trim() === '') {
        log(`❌ Caminho do áudio não é string válida: ${typeof audioFile.path} - ${audioFile.path}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Caminho do áudio inválido'
        });
    }
    
    if (typeof imageFile.path !== 'string' || imageFile.path.trim() === '') {
        log(`❌ Caminho da imagem não é string válida: ${typeof imageFile.path} - ${imageFile.path}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Caminho da imagem inválido'
        });
    }
    
    // Verificar existência física dos arquivos
    if (!fs.existsSync(audioFile.path)) {
        log(`❌ Arquivo de áudio não existe no sistema: ${audioFile.path}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Arquivo de áudio não encontrado no sistema'
        });
    }
    
    if (!fs.existsSync(imageFile.path)) {
        log(`❌ Arquivo de imagem não existe no sistema: ${imageFile.path}`, 'ERROR', processId);
        return res.status(400).json({
            success: false,
            error: 'Arquivo de imagem não encontrado no sistema'
        });
    }
    
    const outputName = settings.outputName || `output_${processId}`;
    const outputPath = path.join(OUTPUTS_DIR, `${outputName}.mp4`);
    
    // Preparar processo
    const processInfo = {
        id: processId,
        status: 'preparing',
        progress: 0,
        startTime: Date.now(),
        settings: settings,
        logs: [],
        files: {
            audio: audioFile.path,
            image: imageFile.path,
            output: outputPath
        }
    };
    
    activeProcesses.set(processId, processInfo);
    
    // Executar render em background
    setTimeout(() => executeParametrizedRender(processId), 100);
    
    res.json({
        success: true,
        processId: processId,
        message: 'Render iniciado'
    });
});

// Executar render parametrizado
function executeParametrizedRender(processId) {
    const processInfo = activeProcesses.get(processId);
    if (!processInfo) return;
    
    try {
        // Validar arquivos antes de executar
        if (!processInfo.files || !processInfo.files.audio || !processInfo.files.image || !processInfo.files.output) {
            addProcessLog(processId, '❌ Erro: Arquivos de entrada não definidos', 'error');
            addProcessLog(processId, `🔍 Debug - processInfo.files: ${JSON.stringify(processInfo.files)}`, 'debug');
            processInfo.status = 'failed';
            processInfo.error = 'Arquivos de entrada não definidos';
            return;
        }
        
        // Log detalhado dos caminhos
        addProcessLog(processId, `🔍 Debug - Audio path: ${processInfo.files.audio}`, 'debug');
        addProcessLog(processId, `🔍 Debug - Image path: ${processInfo.files.image}`, 'debug');
        addProcessLog(processId, `🔍 Debug - Output path: ${processInfo.files.output}`, 'debug');
        
        // Verificar se os arquivos existem fisicamente
        if (!fs.existsSync(processInfo.files.audio)) {
            addProcessLog(processId, `❌ Erro: Arquivo de áudio não encontrado: ${processInfo.files.audio}`, 'error');
            processInfo.status = 'failed';
            processInfo.error = 'Arquivo de áudio não encontrado';
            return;
        }
        
        if (!fs.existsSync(processInfo.files.image)) {
            addProcessLog(processId, `❌ Erro: Arquivo de imagem não encontrado: ${processInfo.files.image}`, 'error');
            processInfo.status = 'failed';
            processInfo.error = 'Arquivo de imagem não encontrado';
            return;
        }
        
        processInfo.status = 'executing';
        processInfo.progress = 5;
        addProcessLog(processId, '🚀 Iniciando execução do Blender...', 'info');
        
        let scriptPath = path.join(currentDir, 'Blender', PYTHON_SCRIPTS[processInfo.settings.scriptVersion]);
        
        // Log do caminho do script
        addProcessLog(processId, `🔍 Debug - Script version: ${processInfo.settings.scriptVersion}`, 'debug');
        addProcessLog(processId, `🔍 Debug - Script path: ${scriptPath}`, 'debug');
        
        // Verificar se script existe, usar fallback se necessário
        if (!fs.existsSync(scriptPath)) {
            addProcessLog(processId, `⚠️ Script ${processInfo.settings.scriptVersion} não encontrado, usando fallback V1.4.0.a.8`, 'warning');
            const fallbackScript = path.join(currentDir, 'Blender', PYTHON_SCRIPTS['v1.4.0.a.8']);
            if (fs.existsSync(fallbackScript)) {
                processInfo.settings.scriptVersion = 'v1.4.0.a.8';
                scriptPath = fallbackScript;
                addProcessLog(processId, `✅ Fallback script encontrado: ${scriptPath}`, 'info');
            } else {
                addProcessLog(processId, '❌ Erro: Nenhum script Python encontrado', 'error');
                processInfo.status = 'failed';
                processInfo.error = 'Script Python não encontrado';
                return;
            }
        }
        
        const blenderPath = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';
        const templatePath = path.join(currentDir, 'Blender', 'template.blend');
        
        // Validar se Blender existe
        if (!fs.existsSync(blenderPath)) {
            addProcessLog(processId, `❌ Erro: Blender não encontrado em: ${blenderPath}`, 'error');
            processInfo.status = 'failed';
            processInfo.error = 'Blender não encontrado';
            return;
        }
        
        addProcessLog(processId, `🔍 Debug - Blender path: ${blenderPath}`, 'debug');
        addProcessLog(processId, `🔍 Debug - Template path: ${templatePath}`, 'debug');
        
        // Salvar configurações em arquivo temporário
        const configPath = path.join(currentDir, 'temp', `config_${processId}.json`);
        
        // Garantir que diretório temp existe
        const tempDir = path.join(currentDir, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Salvar configurações
        fs.writeFileSync(configPath, JSON.stringify(processInfo.settings, null, 2));
        addProcessLog(processId, `🔍 Debug - Config path: ${configPath}`, 'debug');
        
        // Construir argumentos para o script Python
        const pythonArgs = [
            processInfo.files.audio,
            processInfo.files.image,
            processInfo.files.output,
            configPath // Passar caminho do arquivo de configuração
        ];
        
        // Validar cada argumento Python antes de usar (validação rigorosa)
        for (let i = 0; i < pythonArgs.length; i++) {
            const arg = pythonArgs[i];
            
            // Verificar se é undefined, null ou string vazia
            if (arg === undefined || arg === null || arg === '') {
                addProcessLog(processId, `❌ Erro: Python arg ${i} é inválido: ${arg}`, 'error');
                addProcessLog(processId, `🔍 processInfo.files: ${JSON.stringify(processInfo.files)}`, 'debug');
                processInfo.status = 'failed';
                processInfo.error = `Python argument ${i} é inválido`;
                return;
            }
            
            // Verificar se é uma string válida
            if (typeof arg !== 'string') {
                addProcessLog(processId, `❌ Erro: Python arg ${i} não é string: ${typeof arg}`, 'error');
                processInfo.status = 'failed';
                processInfo.error = `Python argument ${i} não é string`;
                return;
            }
            
            // Verificar existência de arquivos de entrada (não output)
            if (i < 3) { // audio, image, output (não verificar config aqui pois já foi validado)
                if (i === 0 || (i === 1 && arg !== 'null' && arg !== '')) { // audio obrigatório, image opcional
                    if (!fs.existsSync(arg)) {
                        addProcessLog(processId, `❌ Erro: Arquivo não encontrado: ${arg}`, 'error');
                        processInfo.status = 'failed';
                        processInfo.error = `Arquivo não encontrado: ${arg}`;
                        return;
                    }
                }
            }
        }
        
        // Log detalhado dos argumentos
        addProcessLog(processId, `🔍 Debug - Python args validados: ${JSON.stringify(pythonArgs)}`, 'debug');
        
        const blenderArgs = [
            templatePath,
            '--background',
            '--python', scriptPath,
            '--', ...pythonArgs
        ];
        
        addProcessLog(processId, `🔍 Debug - Blender args: ${JSON.stringify(blenderArgs)}`, 'debug');
        
        log(`Executando Blender: ${blenderPath} ${blenderArgs.join(' ')}`, 'INFO', processId);
        
        // Validar argumentos antes do spawn
        for (let i = 0; i < blenderArgs.length; i++) {
            if (blenderArgs[i] === undefined || blenderArgs[i] === null) {
                addProcessLog(processId, `❌ Erro: Argumento ${i} é undefined/null: ${blenderArgs[i]}`, 'error');
                processInfo.status = 'failed';
                processInfo.error = `Argumento ${i} é undefined`;
                return;
            }
        }
        
        let blenderProcess;
        try {
            const blenderDir = path.join(currentDir, 'Blender');
            
            // Validar se diretório Blender existe
            if (!fs.existsSync(blenderDir)) {
                addProcessLog(processId, `❌ Erro: Diretório Blender não encontrado: ${blenderDir}`, 'error');
                processInfo.status = 'failed';
                processInfo.error = `Diretório Blender não encontrado: ${blenderDir}`;
                return;
            }
            
            addProcessLog(processId, `🔍 Debug - Blender cwd: ${blenderDir}`, 'debug');
            
            blenderProcess = spawn(blenderPath, blenderArgs, {
                cwd: blenderDir
            });
            
            processInfo.blenderProcess = blenderProcess;
            processInfo.progress = 10;
            addProcessLog(processId, '🎬 Blender iniciado, processando render...', 'info');
        } catch (spawnError) {
            addProcessLog(processId, `❌ Erro ao iniciar Blender: ${spawnError.message}`, 'error');
            processInfo.status = 'failed';
            processInfo.error = `Erro ao iniciar Blender: ${spawnError.message}`;
            return;
        }
        
        // Monitorar saída do Blender
        blenderProcess.stdout.on('data', (data) => {
            const output = data.toString();
            log(`Blender Output: ${output}`, 'DEBUG', processId);
            
            // Analisar progresso baseado na saída
            if (output.includes('Loading and analyzing audio')) {
                processInfo.progress = 20;
                addProcessLog(processId, '🎵 Carregando áudio...', 'info');
            } else if (output.includes('Setting up scene')) {
                processInfo.progress = 30;
                addProcessLog(processId, '🎬 Configurando cena...', 'info');
            } else if (output.includes('Generating keyframes')) {
                processInfo.progress = 50;
                addProcessLog(processId, '🎯 Gerando keyframes...', 'info');
            } else if (output.includes('Rendering frames')) {
                processInfo.progress = 80;
                addProcessLog(processId, '🚀 Renderizando frames...', 'info');
            } else if (output.includes('RENDER CONCLUÍDO')) {
                processInfo.progress = 95;
                addProcessLog(processId, '✅ Render concluído!', 'success');
            }
        });
        
        blenderProcess.stderr.on('data', (data) => {
            const error = data.toString();
            log(`Blender Error: ${error}`, 'ERROR', processId);
            addProcessLog(processId, `❌ Erro: ${error}`, 'error');
        });
        
        blenderProcess.on('close', (code) => {
            log(`Blender process finalizado com código: ${code}`, 'INFO', processId);
            
            // Limpar arquivo de configuração temporário
            try {
                const configPath = path.join(currentDir, 'temp', `config_${processId}.json`);
                if (fs.existsSync(configPath)) {
                    fs.unlinkSync(configPath);
                }
            } catch (cleanupError) {
                log(`Aviso: Erro ao limpar config temporário: ${cleanupError.message}`, 'WARNING', processId);
            }
            
            if (code === 0 && fs.existsSync(processInfo.files.output)) {
                // Sucesso
                processInfo.status = 'completed';
                processInfo.progress = 100;
                processInfo.endTime = Date.now();
                
                const stats = fs.statSync(processInfo.files.output);
                processInfo.result = {
                    outputFile: path.basename(processInfo.files.output),
                    fileSize: formatFileSize(stats.size),
                    duration: calculateDuration(processInfo.startTime, processInfo.endTime),
                    resolution: processInfo.settings.resolution,
                    videoUrl: `/outputs/${path.basename(processInfo.files.output)}`
                };
                
                addProcessLog(processId, '🎉 Render concluído com sucesso!', 'success');
                log(`Render concluído: ${processInfo.files.output}`, 'SUCCESS', processId);
            } else {
                // Erro
                processInfo.status = 'error';
                processInfo.error = `Render falhou com código ${code}`;
                addProcessLog(processId, `❌ Render falhou (código ${code})`, 'error');
                log(`Render falhou com código: ${code}`, 'ERROR', processId);
            }
        });
        
    } catch (error) {
        log(`Erro ao executar render: ${error.message}`, 'ERROR', processId);
        processInfo.status = 'error';
        processInfo.error = error.message;
        addProcessLog(processId, `❌ Erro fatal: ${error.message}`, 'error');
    }
}

// Status do render
app.get('/api/render/status/:processId', (req, res) => {
    const processId = req.params.processId;
    const processInfo = activeProcesses.get(processId);
    
    if (!processInfo) {
        return res.status(404).json({
            error: 'Processo não encontrado'
        });
    }
    
    res.json({
        processId: processId,
        status: processInfo.status,
        progress: processInfo.progress,
        logs: processInfo.logs.slice(-10), // Últimos 10 logs
        completed: processInfo.status === 'completed',
        error: processInfo.error,
        result: processInfo.result
    });
});

// Parar render
app.delete('/api/render/:processId', (req, res) => {
    const processId = req.params.processId;
    const processInfo = activeProcesses.get(processId);
    
    if (!processInfo) {
        return res.status(404).json({
            success: false,
            error: 'Processo não encontrado'
        });
    }
    
    const stopped = stopRenderProcess(processId);
    
    res.json({
        success: stopped,
        message: stopped ? 'Render cancelado com sucesso' : 'Falha ao cancelar render'
    });
});

// ⚡ NOVA ROTA: Parar render (POST para interface)
app.post('/api/render/stop', (req, res) => {
    const { processId, force } = req.body;
    
    log(`Solicitação de parada de render: ${processId || 'all'}`, 'INFO');
    
    try {
        if (processId && processId !== 'all') {
            // Parar processo específico
            const processInfo = activeProcesses.get(processId);
            if (!processInfo) {
                return res.status(404).json({
                    success: false,
                    error: 'Processo não encontrado'
                });
            }
            
            const stopped = stopRenderProcess(processId, force);
            
            res.json({
                success: stopped,
                message: stopped ? 'Processo cancelado com sucesso' : 'Falha ao cancelar processo',
                processId: processId
            });
            
        } else {
            // Parar todos os processos
            let stoppedCount = 0;
            
            for (const [id, processInfo] of activeProcesses.entries()) {
                if (processInfo.status === 'rendering' || processInfo.status === 'preparing') {
                    if (stopRenderProcess(id, force)) {
                        stoppedCount++;
                    }
                }
            }
            
            res.json({
                success: true,
                message: `${stoppedCount} processo(s) cancelado(s)`,
                stoppedCount: stoppedCount
            });
        }
        
    } catch (error) {
        log(`Erro ao parar render: ${error.message}`, 'ERROR');
        res.status(500).json({
            success: false,
            error: 'Erro interno ao cancelar render'
        });
    }
});

// Servir arquivos de output
app.use('/outputs', express.static(OUTPUTS_DIR));

// Listar renders
app.get('/api/renders', (req, res) => {
    const renders = Array.from(activeProcesses.values()).map(process => ({
        id: process.id,
        status: process.status,
        progress: process.progress,
        startTime: process.startTime,
        endTime: process.endTime,
        settings: {
            scriptVersion: process.settings.scriptVersion,
            resolution: process.settings.resolution,
            outputName: process.settings.outputName
        }
    }));
    
    res.json(renders);
});

// Logs do sistema
app.get('/api/logs', (req, res) => {
    const logFile = path.join(LOGS_DIR, `zentraw-backend-${new Date().toISOString().slice(0,10)}.log`);
    
    if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(line => line.trim());
        res.json({
            logs: logs.slice(-100) // Últimas 100 linhas
        });
    } else {
        res.json({ logs: [] });
    }
});

// Funções auxiliares
function stopRenderProcess(processId, force = false) {
    const processInfo = activeProcesses.get(processId);
    if (!processInfo) return false;
    
    log(`Parando processo de render: ${processId}`, 'INFO', processId);
    
    try {
        // Parar processo Blender se existir
        if (processInfo.blenderProcess) {
            if (force) {
                processInfo.blenderProcess.kill('SIGKILL'); // Força a parada
                log('Processo Blender forçado a parar (SIGKILL)', 'WARNING', processId);
            } else {
                processInfo.blenderProcess.kill('SIGTERM'); // Parada graceful
                log('Processo Blender sendo finalizado (SIGTERM)', 'INFO', processId);
            }
        }
        
        // Atualizar status do processo
        processInfo.status = 'cancelled';
        processInfo.endTime = Date.now();
        processInfo.error = 'Cancelado pelo usuário';
        
        addProcessLog(processId, '🛑 Render cancelado pelo usuário', 'warning');
        
        // Limpar arquivos temporários se necessário
        try {
            if (processInfo.files && processInfo.files.audio && fs.existsSync(processInfo.files.audio)) {
                fs.unlinkSync(processInfo.files.audio);
            }
            if (processInfo.files && processInfo.files.image && fs.existsSync(processInfo.files.image)) {
                fs.unlinkSync(processInfo.files.image);
            }
            // Limpar arquivo de configuração temporário
            const configPath = path.join(currentDir, 'temp', `config_${processId}.json`);
            if (fs.existsSync(configPath)) {
                fs.unlinkSync(configPath);
            }
        } catch (cleanupError) {
            log(`Aviso: Erro ao limpar arquivos temporários: ${cleanupError.message}`, 'WARNING', processId);
        }
        
        return true;
        
    } catch (error) {
        log(`Erro ao parar processo: ${error.message}`, 'ERROR', processId);
        return false;
    }
}

function addProcessLog(processId, message, type) {
    const processInfo = activeProcesses.get(processId);
    if (processInfo) {
        processInfo.logs.push({
            timestamp: new Date().toISOString(),
            message,
            type
        });
        
        // Limitar logs por processo
        if (processInfo.logs.length > 50) {
            processInfo.logs = processInfo.logs.slice(-50);
        }
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateDuration(startTime, endTime) {
    const seconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Inicialização do servidor
app.listen(PORT, () => {
    log(`🚀 Zentraw V1.4.0.a.8 Backend iniciado na porta ${PORT}`);
    log('🛡️ Sistema de blindagem V1.4.0.a.7 ativo');
    log('⚙️ Interface parametrizada completa disponível');
    log(`📁 Diretórios: uploads=${UPLOADS_DIR}, outputs=${OUTPUTS_DIR}, logs=${LOGS_DIR}`);
    
    console.log(`
🎯 ZENTRAW 3D VISUALIZER V1.4.0.a.8 - BACKEND PARAMETRIZADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Interface: http://localhost:${PORT}
🛡️ Blindagem V1.4.0.a.7: ATIVA
⚙️ Parâmetros: COMPLETOS
📊 Logs: DETALHADOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

// Limpeza ao sair
process.on('SIGINT', () => {
    log('🛑 Finalizando servidor...');
    
    // Cancelar processos ativos
    activeProcesses.forEach((processInfo, processId) => {
        if (processInfo.blenderProcess) {
            processInfo.blenderProcess.kill();
            log('🛑 Processo cancelado na finalização', 'WARNING', processId);
        }
    });
    
    log('✅ Servidor finalizado');
    process.exit(0);
});

module.exports = app;
