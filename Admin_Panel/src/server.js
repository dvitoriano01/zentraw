const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Carregar variáveis de ambiente do .env
require('dotenv').config();

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
// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// ===============================================
// 🔧 API MANAGER ROUTES - GROK TEAM INTEGRATION
// ===============================================

// Status das APIs externas
app.get('/api/external-apis/status', (req, res) => {
    try {
        // Função para verificar se uma chave está realmente configurada
        const isConfigured = (key) => {
            const value = process.env[key];
            return value && 
                   value !== '' && 
                   value !== 'your-key-here' && 
                   value !== 'sk_test_your-stripe-key' &&
                   value !== 'your-twilio-sid' &&
                   value !== 'your-twilio-token' &&
                   value !== 'your-google-key' &&
                   !value.includes('your-') &&
                   !value.includes('example');
        };
        
        const apiStatus = {
            openai: {
                name: 'OpenAI',
                status: isConfigured('OPENAI_API_KEY') ? 'active' : 'inactive',
                configured: isConfigured('OPENAI_API_KEY'),
                masked: isConfigured('OPENAI_API_KEY') ? maskApiKey(process.env.OPENAI_API_KEY) : null
            },
            spotify: {
                name: 'Spotify',
                status: (isConfigured('SPOTIFY_CLIENT_ID') && isConfigured('SPOTIFY_CLIENT_SECRET')) ? 'active' : 'inactive',
                configured: (isConfigured('SPOTIFY_CLIENT_ID') && isConfigured('SPOTIFY_CLIENT_SECRET')),
                masked: isConfigured('SPOTIFY_CLIENT_ID') ? maskApiKey(process.env.SPOTIFY_CLIENT_ID) : null
            },
            github: {
                name: 'GitHub',
                status: isConfigured('GITHUB_TOKEN') ? 'active' : 'inactive',
                configured: isConfigured('GITHUB_TOKEN'),
                masked: isConfigured('GITHUB_TOKEN') ? maskApiKey(process.env.GITHUB_TOKEN) : null
            },
            supabase: {
                name: 'Supabase',
                status: (isConfigured('SUPABASE_URL') && isConfigured('SUPABASE_KEY')) ? 'active' : 'inactive',
                configured: (isConfigured('SUPABASE_URL') && isConfigured('SUPABASE_KEY')),
                masked: isConfigured('SUPABASE_URL') ? maskApiKey(process.env.SUPABASE_URL) : null
            },
            blender: {
                name: 'Blender',
                status: isConfigured('BLENDER_PATH') ? 'active' : 'inactive',
                configured: isConfigured('BLENDER_PATH'),
                masked: isConfigured('BLENDER_PATH') ? maskApiKey(process.env.BLENDER_PATH) : null
            },
            stripe: {
                name: 'Stripe',
                status: isConfigured('STRIPE_API_KEY') ? 'active' : 'inactive',
                configured: isConfigured('STRIPE_API_KEY'),
                masked: isConfigured('STRIPE_API_KEY') ? maskApiKey(process.env.STRIPE_API_KEY) : null
            },
            twilio: {
                name: 'Twilio',
                status: (isConfigured('TWILIO_ACCOUNT_SID') && isConfigured('TWILIO_AUTH_TOKEN')) ? 'active' : 'inactive',
                configured: (isConfigured('TWILIO_ACCOUNT_SID') && isConfigured('TWILIO_AUTH_TOKEN')),
                masked: isConfigured('TWILIO_ACCOUNT_SID') ? maskApiKey(process.env.TWILIO_ACCOUNT_SID) : null
            }
        };
        
        const activeCount = Object.values(apiStatus).filter(api => api.status === 'active').length;
        
        res.json({
            success: true,
            apis: apiStatus,
            total: Object.keys(apiStatus).length,
            active: activeCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao verificar status das APIs',
            details: error.message
        });
    }
});

// Executar API Manager (Python)
app.post('/api/external-apis/initialize', (req, res) => {
    try {
        const pythonScript = path.join(__dirname, 'api_manager.py');
        const pythonProcess = spawn('python', [pythonScript], {
            stdio: 'pipe',
            env: process.env
        });
        
        let output = '';
        let errorOutput = '';
        
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                res.json({
                    success: true,
                    message: 'API Manager inicializado com sucesso',
                    output: output
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erro ao inicializar API Manager',
                    code: code,
                    output: errorOutput
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao executar API Manager',
            details: error.message
        });
    }
});

// Atualizar configurações de APIs no arquivo .env
app.post('/api/external-apis/config', (req, res) => {
    try {
        const { apiKey, apiValue } = req.body;
        
        // Validação de segurança
        if (!apiKey || !apiValue) {
            return res.status(400).json({
                success: false,
                error: 'Chave e valor da API são obrigatórios'
            });
        }
        
        // Lista de chaves válidas para segurança
        const validKeys = [
            'OPENAI_API_KEY',
            'SPOTIFY_CLIENT_ID',
            'SPOTIFY_CLIENT_SECRET',
            'GITHUB_TOKEN',
            'SUPABASE_URL',
            'SUPABASE_KEY',
            'BLENDER_PATH',
            'STRIPE_API_KEY',
            'TWILIO_ACCOUNT_SID',
            'TWILIO_AUTH_TOKEN',
            'GOOGLE_API_KEY'
        ];
        
        if (!validKeys.includes(apiKey)) {
            return res.status(400).json({
                success: false,
                error: 'Chave de API não é válida'
            });
        }
        
        // Ler arquivo .env atual
        const envPath = path.join(__dirname, '../.env');
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }
        
        // Atualizar ou adicionar chave
        const keyRegex = new RegExp(`^${apiKey}=.*$`, 'm');
        const newKeyValue = `${apiKey}=${apiValue}`;
        
        if (keyRegex.test(envContent)) {
            // Atualizar chave existente
            envContent = envContent.replace(keyRegex, newKeyValue);
        } else {
            // Adicionar nova chave
            envContent += `\n${newKeyValue}`;
        }
        
        // Salvar arquivo .env
        fs.writeFileSync(envPath, envContent, 'utf8');
        
        // Atualizar variável de ambiente na sessão atual
        process.env[apiKey] = apiValue;
        
        res.json({
            success: true,
            message: `Chave ${apiKey} atualizada com sucesso`,
            key: apiKey,
            masked: maskApiKey(apiValue)
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar configuração',
            details: error.message
        });
    }
});

// Endpoint para testar conexão com APIs específicas
app.get('/api/external-apis/test/:apiType', (req, res) => {
    try {
        const { apiType } = req.params;
        
        // Validar tipo de API
        const validTypes = ['openai', 'spotify', 'github', 'supabase', 'blender', 'stripe', 'twilio'];
        if (!validTypes.includes(apiType)) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de API inválido'
            });
        }
        
        // Simulação de teste de conexão
        const testResults = {
            openai: {
                endpoint: 'https://api.openai.com/v1/models',
                status: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
                message: process.env.OPENAI_API_KEY ? 'Chave configurada' : 'Chave não configurada'
            },
            spotify: {
                endpoint: 'https://api.spotify.com/v1/me',
                status: (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) ? 'configured' : 'not_configured',
                message: (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) ? 'Credenciais configuradas' : 'Credenciais não configuradas'
            },
            github: {
                endpoint: 'https://api.github.com/user',
                status: process.env.GITHUB_TOKEN ? 'configured' : 'not_configured',
                message: process.env.GITHUB_TOKEN ? 'Token configurado' : 'Token não configurado'
            },
            supabase: {
                endpoint: process.env.SUPABASE_URL || 'not_configured',
                status: (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) ? 'configured' : 'not_configured',
                message: (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) ? 'Configuração completa' : 'Configuração incompleta'
            },
            blender: {
                endpoint: process.env.BLENDER_PATH || 'not_configured',
                status: process.env.BLENDER_PATH ? 'configured' : 'not_configured',
                message: process.env.BLENDER_PATH ? 'Caminho configurado' : 'Caminho não configurado'
            },
            stripe: {
                endpoint: 'https://api.stripe.com/v1/account',
                status: process.env.STRIPE_API_KEY ? 'configured' : 'not_configured',
                message: process.env.STRIPE_API_KEY ? 'Chave configurada' : 'Chave não configurada'
            },
            twilio: {
                endpoint: 'https://api.twilio.com/2010-04-01/Accounts.json',
                status: (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ? 'configured' : 'not_configured',
                message: (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ? 'Credenciais configuradas' : 'Credenciais não configuradas'
            }
        };
        
        const result = testResults[apiType];
        
        res.json({
            success: true,
            apiType: apiType,
            test: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao testar API',
            details: error.message
        });
    }
});

// Endpoint para verificar saúde da API (diferente do /health principal)
app.get('/api/health', (req, res) => {
    try {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            apis: {
                external_apis: 'operational',
                admin_panel: 'operational'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Função para mascarar chaves API para segurança
function maskApiKey(key) {
    if (!key || key.length < 8) return '***';
    const start = key.substring(0, 4);
    const end = key.substring(key.length - 4);
    const middle = '*'.repeat(key.length - 8);
    return `${start}${middle}${end}`;
}

// ===============================================
// 🏠 ZENTRAW ADMIN PANEL MAIN ROUTES
// ===============================================

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

// ===============================================
// 🌐 ZENTRAW GLOBAL CONFIGURATION ROUTES
// ===============================================

// Endpoint para detectar conflitos de configuração
app.get('/api/config/conflicts', (req, res) => {
    try {
        const conflicts = [];
        
        // Verificar conflitos de API
        const apiKeys = ['OPENAI_API_KEY', 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 
                        'GITHUB_TOKEN', 'SUPABASE_URL', 'SUPABASE_KEY', 'BLENDER_PATH'];
        
        apiKeys.forEach(key => {
            const value = process.env[key];
            if (value && (value.includes('your-') || value.includes('example') || value === '')) {
                conflicts.push({
                    type: 'api_configuration',
                    key: key,
                    issue: 'Chave de API não configurada adequadamente'
                });
            }
        });
        
        res.json({
            success: true,
            conflicts: conflicts,
            total: conflicts.length,
            checked_at: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao detectar conflitos',
            details: error.message
        });
    }
});

// Endpoint para status global do Zentraw
app.get('/api/global/status', (req, res) => {
    try {
        const globalStatus = {
            admin_panel: {
                status: 'online',
                port: PORT,
                version: '1.0.0'
            },
            apis: {
                configured: 0,
                total: 7
            }
        };
        
        // Contar APIs configuradas
        const apiKeys = ['OPENAI_API_KEY', 'SPOTIFY_CLIENT_ID', 'GITHUB_TOKEN', 
                        'SUPABASE_URL', 'BLENDER_PATH', 'STRIPE_API_KEY', 'TWILIO_ACCOUNT_SID'];
        
        apiKeys.forEach(key => {
            const isConfigured = process.env[key] && 
                               process.env[key] !== '' && 
                               !process.env[key].includes('your-') && 
                               !process.env[key].includes('example');
            
            if (isConfigured) {
                globalStatus.apis.configured++;
            }
        });
        
        res.json({
            success: true,
            zentraw_global_status: globalStatus,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao obter status global',
            details: error.message
        });
    }
});

// ===============================================
// END GLOBAL CONFIGURATION ROUTES
// ===============================================

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
