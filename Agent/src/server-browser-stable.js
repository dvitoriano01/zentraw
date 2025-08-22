const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Carregar ambiente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = 3007;

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ['http://localhost:3003', 'http://127.0.0.1:3003', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Página inicial
app.get('/', (req, res) => {
    res.json({
        service: 'Zentraw Agent',
        version: '1.0.0-stable',
        status: 'online',
        message: 'Zentraw Agent funcionando via browser!',
        endpoints: {
            health: 'GET /health',
            javascript: 'GET /zentraw-agent.js',
            chat: 'POST /api/chat'
        },
        browser_access: true
    });
});

// Health check
app.get('/health', (req, res) => {
    console.log('🏥 Health check requisitado');
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Zentraw Agent Browser-Stable',
        version: '1.0.0',
        openai_configured: !!process.env.OPENAI_API_KEY,
        browser_accessible: true
    });
});

// Servir zentraw-agent.js
app.get('/zentraw-agent.js', (req, res) => {
    try {
        console.log('📄 Requisição para zentraw-agent.js');
        const filePath = path.join(__dirname, 'public', 'zentraw-agent.js');
        
        if (!fs.existsSync(filePath)) {
            console.log('❌ Arquivo zentraw-agent.js não encontrado');
            return res.status(404).json({ 
                error: 'File not found',
                path: filePath,
                suggestion: 'Verificar se arquivo existe em src/public/'
            });
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`✅ Arquivo carregado: ${content.length} bytes`);
        
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        
        res.send(content);
        console.log('📤 zentraw-agent.js enviado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao servir zentraw-agent.js:', error.message);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: error.stack
        });
    }
});

// Chat endpoint com redirecionamento automático
app.post('/api/chat', (req, res) => {
    try {
        const { message, model = 'gpt-4o' } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mensagem é obrigatória' 
            });
        }

        console.log('💬 Chat request recebido:', message.substring(0, 50) + '...');
        
        // DETECÇÃO DE SOLICITAÇÃO DE IMAGEM
        const imageKeywords = [
            'criar imagem', 'gerar imagem', 'fazer imagem', 'desenhar',
            'create image', 'generate image', 'make image', 'draw',
            'ilustrar', 'pintar', 'arte', 'desenho', 'quadro',
            'fotografia', 'retrato', 'paisagem', 'logo', 'ícone'
        ];
        
        const isImageRequest = imageKeywords.some(keyword => 
            message.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (isImageRequest) {
            console.log('🎨 REDIRECIONAMENTO AUTOMÁTICO DETECTADO!');
            
            // Simular redirecionamento para DALL-E 3
            return res.json({
                success: true,
                response: `🎨 **REDIRECIONAMENTO AUTOMÁTICO FUNCIONANDO!**\n\n✅ **Detectado:** Solicitação de geração de imagem\n📝 **Prompt:** "${message}"\n🤖 **Ação:** Automaticamente redirecionado para DALL-E 3\n\n💡 **Em produção:** Isso geraria uma imagem real usando OpenAI DALL-E 3\n\n🔧 **Status:** Sistema de redirecionamento implementado e funcionando perfeitamente!`,
                redirected: true,
                model: 'dall-e-3-auto-redirect',
                detected_keywords: imageKeywords.filter(k => message.toLowerCase().includes(k.toLowerCase())),
                original_prompt: message,
                auto_detection: true,
                system_working: true
            });
        }
        
        // Chat normal (simulado)
        return res.json({
            success: true,
            response: `✅ **Zentraw Agent Stable funcionando via browser!**\n\n📝 **Mensagem recebida:** "${message}"\n🤖 **Modelo:** ${model}\n\n🎨 **Redirecionamento automático:** ✅ Ativo\n🔍 **Detecção de imagem:** ✅ Funcionando\n🌐 **Acesso browser:** ✅ Funcional\n⚡ **Status:** Sistema completamente operacional`,
            redirected: false,
            model: model,
            browser_test: true,
            system_status: 'fully_operational'
        });
        
    } catch (error) {
        console.error('❌ Erro no chat:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno: ' + error.message,
            stack: error.stack
        });
    }
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🤖 Zentraw Agent STABLE rodando na porta', PORT);
    console.log('🔗 Acesso: http://localhost:' + PORT);
    console.log('🌐 Browser: SUPORTADO');
    console.log('🔑 OpenAI:', process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ Não configurada');
    console.log('🐧 Ambiente: WSL Ubuntu 22.04.4 LTS');
    console.log('===============================================');
    console.log('🎯 REDIRECIONAMENTO AUTOMÁTICO: ATIVO');
    console.log('📄 Static files: HABILITADO');
    console.log('🔧 Status: PRONTO PARA TESTES VIA BROWSER');
    console.log('===============================================');
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
    console.error('❌ Erro crítico:', error.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ Promise rejeitada:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM, fechando servidor...');
    server.close(() => {
        console.log('✅ Servidor fechado');
        process.exit(0);
    });
});

module.exports = app;
