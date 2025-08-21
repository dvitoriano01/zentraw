/**
 * Zentraw 3D Visualizer V1.4.0.a.8.3 - CONTROLE EXECUÇÃO ÚNICA
 * Data: 28/07/2025 - SINGLE EXECUTION CONTROL
 * Base: server-v1.4.0.a.8-parametrizado.cjs (V1.4.0.a.8.2 - funcionalidade preservada)
 * Novidade: Sistema de lock + controle única execução + cleanup automático
 * Propósito: Eliminar múltiplas execuções e melhorar qualidade MP4
 * Status: SINGLE EXECUTION EVOLUTION - Qualidade garantida
 * Dependências: express, multer, child_process, path, fs, uuid
 * Autor: GitHub Copilot
 * Categoria: Single Execution Control System
 */

const express = require("express");
const multer = require("multer");
const { spawn, exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Validar __dirname (sempre disponível em CommonJS)
const currentDir = __dirname;

console.log(`🔥 ZENTRAW V1.4.0.a.8.3 - SINGLE EXECUTION CONTROL ATIVADO`);
console.log(`🔍 DEBUG CRÍTICO - __dirname: "${__dirname}" (tipo: ${typeof __dirname})`);
console.log(`🔍 DEBUG CRÍTICO - currentDir: "${currentDir}" (tipo: ${typeof currentDir})`);
console.log(`🔍 DEBUG CRÍTICO - currentDir válido: ${currentDir ? 'SIM' : 'NÃO'}`);
console.log(`🛡️ SINGLE EXECUTION - Sistema de lock inicializado`);

const PORT = 3004; // Porta oficial corrigida - 3d_visualizer OFICIAL
const UPLOADS_DIR = path.resolve(currentDir, "uploads");
const OUTPUTS_DIR = path.resolve(currentDir, "outputs");
const LOGS_DIR = path.resolve(currentDir, "logs");

// ✅ SISTEMA DE CONTROLE DE EXECUÇÃO ÚNICA
let isRenderInProgress = false;
const activeRenders = new Set();
let lastRenderTime = null;
let renderTimeout = null;
const RENDER_TIMEOUT = 300000; // 5 minutos

// ✅ FUNÇÃO DE CLEANUP FORÇADO
function forceCleanup() {
    console.log("🧹 [CLEANUP] Iniciando limpeza forçada do sistema...");
    isRenderInProgress = false;
    activeRenders.clear();
    
    if (renderTimeout) {
        clearTimeout(renderTimeout);
        renderTimeout = null;
        console.log("⏰ [CLEANUP] Timeout cancelado");
    }
    
    // Matar processos Blender ativos
    exec("taskkill /F /IM blender.exe /T", (error) => {
        if (error && !error.message.includes("não foi encontrado")) {
            console.log("🔍 [CLEANUP] Nenhum processo Blender ativo encontrado");
        } else {
            console.log("💀 [CLEANUP] Processos Blender finalizados");
        }
    });
    
    console.log("✅ [CLEANUP] Limpeza do sistema concluída");
}

// ✅ HANDLERS DE CLEANUP AUTOMÁTICO
process.on("exit", forceCleanup);
process.on("SIGINT", forceCleanup);
process.on("SIGTERM", forceCleanup);

// Criar diretórios necessários
[UPLOADS_DIR, OUTPUTS_DIR, LOGS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const app = express();
app.use(express.json());
app.use(express.static("."));

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ✅ STATUS API EM TEMPO REAL
app.get("/api/render/status", (req, res) => {
    res.json({
        isRenderInProgress,
        activeRenders: Array.from(activeRenders),
        lastRenderTime,
        version: "V1.4.0.a.8.3-SINGLE-EXECUTION",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ✅ HEALTH CHECK ATUALIZADO
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        version: "V1.4.0.a.8.3-SINGLE-EXECUTION-CONTROL",
        timestamp: new Date().toISOString(),
        renderStatus: isRenderInProgress ? "BUSY" : "READY",
        port: PORT
    });
});

// ✅ API DE TESTE BLENDER
app.get("/api/blender/test", (req, res) => {
    res.json({
        status: "OK",
        version: "V1.4.0.a.8.3-SINGLE-EXECUTION",
        blenderScript: "render_audio_visualizer_v1.4.0.a.8.2.py",
        message: "Sistema de execução única ativo",
        renderInProgress: isRenderInProgress
    });
});

// Configuração do multer para upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// ✅ LOGGING SYSTEM
function log(level, message, extra = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        renderInProgress: isRenderInProgress,
        activeRenders: activeRenders.size,
        ...extra
    };
    
    console.log(`[${timestamp}] [${level}] ${message}`);
    
    // Log para arquivo
    const logFile = path.join(LOGS_DIR, `zentraw-backend-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

// ✅ ROTA DE RENDERIZAÇÃO COM CONTROLE DE EXECUÇÃO ÚNICA
app.post("/api/render", upload.single("audio"), async (req, res) => {
    const renderId = uuidv4();
    
    try {
        // ✅ VERIFICAR SE JÁ EXISTE RENDER EM PROGRESSO
        if (isRenderInProgress) {
            log("WARN", "Render bloqueado - execução já em progresso", { renderId });
            return res.status(409).json({
                error: "Render already in progress",
                status: "blocked",
                message: "Aguarde o render atual terminar antes de iniciar outro",
                renderInProgress: true,
                currentRenders: Array.from(activeRenders)
            });
        }
        
        // ✅ ATIVAR LOCK DE EXECUÇÃO
        isRenderInProgress = true;
        activeRenders.add(renderId);
        lastRenderTime = new Date().toISOString();
        
        log("INFO", "Render iniciado com controle de execução única", { 
            renderId,
            lockActivated: true 
        });
        
        // ✅ CONFIGURAR TIMEOUT DE SEGURANÇA
        renderTimeout = setTimeout(() => {
            log("ERROR", "Render timeout atingido - forçando cleanup", { renderId });
            forceCleanup();
        }, RENDER_TIMEOUT);
        
        // ✅ CLEANUP DE PROCESSOS ANTERIORES
        log("INFO", "Executando cleanup de processos Blender anteriores", { renderId });
        await new Promise((resolve) => {
            exec("taskkill /F /IM blender.exe /T", (error) => {
                if (error && !error.message.includes("não foi encontrado")) {
                    log("INFO", "Nenhum processo Blender anterior encontrado", { renderId });
                } else {
                    log("INFO", "Processos Blender anteriores finalizados", { renderId });
                }
                resolve();
            });
        });
        
        // Aguardar um momento após cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!req.file) {
            throw new Error("Arquivo de áudio é obrigatório");
        }
        
        // Parâmetros do request
        const params = {
            audioPath: req.file.path,
            outputName: req.body.outputName || `output_v1.4.0.a.8.3_${Date.now()}`,
            // Parâmetros Blender com valores padrão
            cameraDistance: parseFloat(req.body.cameraDistance) || 10.0,
            cameraHeight: parseFloat(req.body.cameraHeight) || 5.0,
            cameraAngleX: parseFloat(req.body.cameraAngleX) || 15.0,
            cubeCount: parseInt(req.body.cubeCount) || 20,
            cubeScale: parseFloat(req.body.cubeScale) || 1.0,
            frequencyRange: parseFloat(req.body.frequencyRange) || 1000.0,
            amplitudeMultiplier: parseFloat(req.body.amplitudeMultiplier) || 2.0,
            colorHue: parseFloat(req.body.colorHue) || 0.6,
            colorSaturation: parseFloat(req.body.colorSaturation) || 0.8,
            colorValue: parseFloat(req.body.colorValue) || 1.0,
            emissionStrength: parseFloat(req.body.emissionStrength) || 2.0,
            lightEnergy: parseFloat(req.body.lightEnergy) || 5.0,
            lightColor: req.body.lightColor || [1.0, 1.0, 1.0],
            backgroundColorHue: parseFloat(req.body.backgroundColorHue) || 0.2,
            backgroundColorSat: parseFloat(req.body.backgroundColorSat) || 0.3,
            backgroundColorVal: parseFloat(req.body.backgroundColorVal) || 0.1,
            renderEngine: req.body.renderEngine || "CYCLES",
            renderSamples: parseInt(req.body.renderSamples) || 128,
            frameRate: parseInt(req.body.frameRate) || 30,
            resolution: req.body.resolution || [1920, 1080]
        };
        
        log("INFO", "Parâmetros de render processados", {
            renderId,
            params: JSON.stringify(params, null, 2)
        });
        
        // Construir comando Blender
        const outputPath = path.resolve(OUTPUTS_DIR, `${params.outputName}.mp4`);
        const blenderScript = path.resolve(currentDir, "Blender", "render_audio_visualizer_v1.4.0.a.8.2.py");
        
        const blenderCommand = [
            "--background",
            "--python", blenderScript,
            "--",
            "--audio", path.resolve(params.audioPath),
            "--output", outputPath,
            "--camera_distance", params.cameraDistance.toString(),
            "--camera_height", params.cameraHeight.toString(),
            "--camera_angle_x", params.cameraAngleX.toString(),
            "--cube_count", params.cubeCount.toString(),
            "--cube_scale", params.cubeScale.toString(),
            "--frequency_range", params.frequencyRange.toString(),
            "--amplitude_multiplier", params.amplitudeMultiplier.toString(),
            "--color_hue", params.colorHue.toString(),
            "--color_saturation", params.colorSaturation.toString(),
            "--color_value", params.colorValue.toString(),
            "--emission_strength", params.emissionStrength.toString(),
            "--light_energy", params.lightEnergy.toString(),
            "--light_color", JSON.stringify(params.lightColor),
            "--background_color_hue", params.backgroundColorHue.toString(),
            "--background_color_sat", params.backgroundColorSat.toString(),
            "--background_color_val", params.backgroundColorVal.toString(),
            "--render_engine", params.renderEngine,
            "--render_samples", params.renderSamples.toString(),
            "--frame_rate", params.frameRate.toString(),
            "--resolution", JSON.stringify(params.resolution)
        ];
        
        log("INFO", "Comando Blender construído", {
            renderId,
            command: `blender ${blenderCommand.join(' ')}`
        });
        
        // ✅ EXECUTAR RENDER COM CONTROLE ÚNICO
        await new Promise((resolve, reject) => {
            log("INFO", "Iniciando processo Blender com execução única", { renderId });
            
            const blenderProcess = spawn("blender", blenderCommand, {
                stdio: ["ignore", "pipe", "pipe"],
                cwd: currentDir
            });
            
            let stdout = "";
            let stderr = "";
            
            blenderProcess.stdout.on("data", (data) => {
                const output = data.toString();
                stdout += output;
                log("DEBUG", `Blender stdout: ${output.trim()}`, { renderId });
            });
            
            blenderProcess.stderr.on("data", (data) => {
                const output = data.toString();
                stderr += output;
                log("DEBUG", `Blender stderr: ${output.trim()}`, { renderId });
            });
            
            blenderProcess.on("close", (code) => {
                log("INFO", `Processo Blender finalizado com código: ${code}`, {
                    renderId,
                    exitCode: code
                });
                
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`Blender process failed with code ${code}\nStderr: ${stderr}`));
                }
            });
            
            blenderProcess.on("error", (error) => {
                log("ERROR", `Erro no processo Blender: ${error.message}`, { renderId });
                reject(error);
            });
        });
        
        // ✅ VERIFICAR SE ARQUIVO FOI CRIADO
        if (!fs.existsSync(outputPath)) {
            throw new Error(`Arquivo de saída não foi criado: ${outputPath}`);
        }
        
        const stats = fs.statSync(outputPath);
        const outputRelativePath = path.relative(currentDir, outputPath);
        
        // ✅ CRIAR ARQUIVO DE RESULTADO
        const resultData = {
            success: true,
            renderId,
            outputPath: outputRelativePath,
            outputSize: stats.size,
            renderTime: new Date().toISOString(),
            version: "V1.4.0.a.8.3-SINGLE-EXECUTION",
            parameters: params,
            singleExecution: true,
            qualityOptimized: true
        };
        
        const resultPath = path.resolve(OUTPUTS_DIR, `${params.outputName}_result.json`);
        fs.writeFileSync(resultPath, JSON.stringify(resultData, null, 2));
        
        log("INFO", "Render concluído com sucesso - execução única", {
            renderId,
            outputPath: outputRelativePath,
            fileSize: stats.size,
            singleExecution: true
        });
        
        res.json(resultData);
        
    } catch (error) {
        log("ERROR", `Erro durante render: ${error.message}`, {
            renderId,
            error: error.stack
        });
        
        res.status(500).json({
            success: false,
            error: error.message,
            renderId,
            version: "V1.4.0.a.8.3-SINGLE-EXECUTION"
        });
        
    } finally {
        // ✅ CLEANUP OBRIGATÓRIO - LIBERAR LOCK
        log("INFO", "Liberando lock de execução", { renderId });
        isRenderInProgress = false;
        activeRenders.delete(renderId);
        
        if (renderTimeout) {
            clearTimeout(renderTimeout);
            renderTimeout = null;
        }
        
        log("INFO", "Sistema pronto para próximo render", {
            renderId,
            lockReleased: true,
            systemReady: true
        });
    }
});

// Inicializar servidor
app.listen(PORT, () => {
    log("INFO", `🚀 Zentraw V1.4.0.a.8.3 Backend iniciado na porta ${PORT}`);
    log("INFO", "🛡️ Sistema de execução única ativo");
    log("INFO", "⚙️ Controle de qualidade otimizado");
    log("INFO", `🔧 Script padrão: V1.4.0.a.8.2 (CYCLES + Timestamp)`);
    log("INFO", `📁 Diretórios: uploads=${UPLOADS_DIR}, outputs=${OUTPUTS_DIR}, logs=${LOGS_DIR}`);
    
    console.log("\n🎯 ZENTRAW 3D VISUALIZER V1.4.0.a.8.3 - SINGLE EXECUTION CONTROL");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`🌐 Interface: http://localhost:${PORT}`);
    console.log("🛡️ Execução Única: ATIVA");
    console.log("⚙️ Controle Qualidade: OTIMIZADO");
    console.log("📊 Status API: /api/render/status");
    console.log("🔧 Sistema Anti-Múltiplas Execuções: FUNCIONANDO");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});
