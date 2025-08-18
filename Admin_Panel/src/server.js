const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const config = require('../config/default.json');

const app = express();
const PORT = config.server.port || 3001;

// Middleware de segurança
app.use(helmet({
    contentSecurityPolicy: false // Desabilitado para permitir inline scripts na demo
}));

// CORS configurado para permitir outros módulos Zentraw
app.use(cors({
    origin: config.server.cors.origins,
    credentials: true
}));

// Middleware geral
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Log de inicialização
const startTime = new Date();
console.log(`🔧 Zentraw Admin Panel V${config.project.version} iniciando...`);

// ==========================================
// ROUTES - API ENDPOINTS
// ==========================================

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        version: config.project.version,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        modules: {
            templateLibraryBuilder: 'checking',
            '3dVisualizer': 'checking',
            musicIntelligence: 'planned'
        }
    });
});

// Status geral do sistema
app.get('/api/status', (req, res) => {
    res.json({
        system: {
            name: config.project.name,
            version: config.project.version,
            startTime: startTime.toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        },
        modules: config.modules,
        server: {
            port: PORT,
            host: config.server.host
        }
    });
});

// Listar módulos configurados
app.get('/api/modules', (req, res) => {
    const modules = Object.entries(config.modules).map(([key, module]) => ({
        id: key,
        name: module.name,
        url: module.url,
        status: module.status,
        healthCheck: module.healthCheck,
        apis: module.apis
    }));
    
    res.json({
        total: modules.length,
        modules: modules
    });
});

// Verificar saúde de um módulo específico
app.get('/api/modules/:moduleId/health', async (req, res) => {
    const { moduleId } = req.params;
    const module = config.modules[moduleId];
    
    if (!module) {
        return res.status(404).json({
            error: 'Módulo não encontrado',
            moduleId: moduleId
        });
    }
    
    try {
        // Simular verificação de saúde (em produção, faria requisição real)
        const healthResult = {
            moduleId: moduleId,
            name: module.name,
            url: module.url,
            status: module.status === 'active' ? 'online' : 'offline',
            lastCheck: new Date().toISOString(),
            responseTime: Math.random() * 100 + 50, // Simular tempo de resposta
            apis: module.apis.map(api => ({
                endpoint: api,
                status: 'online',
                lastCheck: new Date().toISOString()
            }))
        };
        
        res.json(healthResult);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao verificar saúde do módulo',
            moduleId: moduleId,
            message: error.message
        });
    }
});

// Configurações do sistema
app.get('/api/config', (req, res) => {
    // Retornar configurações públicas (sem segredos)
    const publicConfig = {
        project: config.project,
        server: {
            port: config.server.port,
            host: config.server.host
        },
        modules: config.modules,
        ui: config.ui,
        features: config.features
    };
    
    res.json(publicConfig);
});

// Logs do sistema
app.get('/api/logs', (req, res) => {
    const { level = 'all', limit = 100 } = req.query;
    
    // Simular logs (em produção, leria dos arquivos de log)
    const sampleLogs = [
        {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'Admin Panel iniciado',
            module: 'admin-panel'
        },
        {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            level: 'success',
            message: 'TemplateLibraryBuilder: Health check OK',
            module: 'template-library-builder'
        },
        {
            timestamp: new Date(Date.now() - 120000).toISOString(),
            level: 'warning',
            message: 'Music Intelligence: Módulo não encontrado',
            module: 'music-intelligence'
        }
    ];
    
    let filteredLogs = sampleLogs;
    if (level !== 'all') {
        filteredLogs = sampleLogs.filter(log => log.level === level);
    }
    
    res.json({
        total: filteredLogs.length,
        logs: filteredLogs.slice(0, parseInt(limit))
    });
});

// Estatísticas do sistema
app.get('/api/stats', (req, res) => {
    const stats = {
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        },
        modules: {
            total: Object.keys(config.modules).length,
            active: Object.values(config.modules).filter(m => m.status === 'active').length,
            planned: Object.values(config.modules).filter(m => m.status === 'planned').length
        },
        apis: {
            total: Object.values(config.modules).reduce((acc, module) => acc + module.apis.length, 0),
            healthy: Math.floor(Math.random() * 10) + 5, // Simular APIs saudáveis
            errors: Math.floor(Math.random() * 3) // Simular erros
        },
        requests: {
            total: Math.floor(Math.random() * 1000) + 100,
            successful: Math.floor(Math.random() * 950) + 50,
            failed: Math.floor(Math.random() * 50)
        }
    };
    
    res.json(stats);
});

// ==========================================
// ROUTES - PÁGINAS
// ==========================================

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Rota para arquivos CSS/JS se necessário
app.get('/assets/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, 'assets', file);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Asset not found');
    }
});

// ==========================================
// ERROR HANDLERS
// ==========================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Error Handler Global
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

app.listen(PORT, config.server.host, () => {
    console.log(`✅ Zentraw Admin Panel V${config.project.version} rodando!`);
    console.log(`🌐 URL: http://${config.server.host}:${PORT}`);
    console.log(`📊 Health Check: http://${config.server.host}:${PORT}/health`);
    console.log(`📋 API Status: http://${config.server.host}:${PORT}/api/status`);
    console.log(`🔧 Configuração: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Iniciado em: ${startTime.toLocaleString()}`);
    console.log('='.repeat(60));
    console.log('🚀 Admin Panel está pronto para uso!');
    console.log('📚 Documentação: /docs/README.md');
    console.log('🔍 Monitoramento ativo nos módulos Zentraw');
    console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM, encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Recebido SIGINT, encerrando servidor...');
    process.exit(0);
});

module.exports = app;
