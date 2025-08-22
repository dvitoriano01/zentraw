const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

// Carregar ambiente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configurar OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

// Página inicial - Interface Web do Agent
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Zentraw Agent</title>
    <style>
        @import url("https://fonts.cdnfonts.com/css/thegoodmonolith");

        :root {
            --bg-color: #12100f;
            --grid-color: rgba(255, 240, 230, 0.05);
            --text-primary: #f3ede9;
            --text-secondary: #c2b8b2;
            --text-highlight: #ff4e42;
            --accent-primary: #ff4e42;
            --accent-secondary: #c2362f;
            --accent-tertiary: #ffb3ab;
            --panel-bg: rgba(30, 26, 24, 0.7);
            --panel-border: rgba(255, 78, 66, 0.3);
            --panel-highlight: rgba(255, 78, 66, 0.1);
            --scanner-line: rgba(255, 78, 66, 0.7);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: "TheGoodMonolith", monospace;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-transform: uppercase;
            position: relative;
        }
        .cinema-mode { background: linear-gradient(135deg, #12100f 0%, #1a1815 100%); position: relative; }
        .grid-overlay { 
            position: fixed; 
            top:0; left:0; width:100%; height:100%; 
            background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px); 
            background-size:50px 50px; 
            pointer-events:none; 
            z-index:1; 
            animation:dataFlow 10s infinite linear; 
            opacity:0.8; 
        }
        .scanner-frame { 
            position: fixed; 
            top:20px; left:20px; right:20px; bottom:20px; 
            border:2px solid var(--accent-primary); 
            pointer-events:none; 
            z-index:5; 
            animation:pulseGlow 3s infinite; 
            border-radius:4px; 
        }
        .scanner-line { 
            position:absolute; 
            top:0; left:0; width:100%; height:2px; 
            background:linear-gradient(90deg, transparent, var(--scanner-line), transparent); 
            animation:scanMove 3s ease-in-out infinite; 
            opacity:0; 
            box-shadow:0 0 10px var(--scanner-line); 
        }
        @keyframes scanMove { 0%,100%{transform:translateY(0);opacity:0;} 50%{transform:translateY(calc(100vh - 80px));opacity:0.7;} }
        @keyframes pulseGlow { 0%,100%{ box-shadow:0 0 5px var(--accent-primary);} 50%{ box-shadow:0 0 20px var(--accent-primary),0 0 30px var(--accent-primary);} }
        @keyframes dataFlow { 0%{transform:translateX(-100%);opacity:0;} 50%{opacity:1;} 100%{transform:translateX(100%);opacity:0;} }
        
        .container {
            max-width: 800px;
            width: 100%;
            background: var(--panel-bg);
            border: 2px solid var(--panel-border);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 0 30px rgba(255, 78, 66, 0.3);
            backdrop-filter: blur(10px);
            z-index: 10;
            position: relative;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            font-size: 2.5em;
            color: var(--accent-primary);
            margin-bottom: 10px;
            text-shadow: 0 0 10px var(--accent-primary);
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.8;
            color: var(--text-secondary);
        }
        .status {
            background: var(--panel-highlight);
            border: 1px solid var(--accent-primary);
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: var(--accent-primary);
        }
        .chat-container {
            margin-top: 30px;
        }
        .chat-messages {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            padding: 20px;
            height: 300px;
            overflow-y: auto;
            margin-bottom: 20px;
            border: 1px solid var(--panel-border);
        }
        .message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
        }
        .message.assistant {
            background: var(--panel-highlight);
            border-left: 3px solid var(--accent-primary);
            color: var(--text-primary);
        }
        .message.user {
            background: rgba(255, 255, 255, 0.05);
            border-left: 3px solid var(--text-secondary);
            margin-left: 20px;
            color: var(--text-primary);
        }
        .input-container {
            display: flex;
            gap: 10px;
        }
        .input-field {
            flex: 1;
            padding: 15px;
            border: 1px solid var(--panel-border);
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            color: var(--text-primary);
            font-size: 1em;
            font-family: inherit;
        }
        .input-field:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 10px rgba(255, 78, 66, 0.3);
        }
        .input-field::placeholder {
            color: var(--text-secondary);
            opacity: 0.7;
        }
        .send-btn {
            padding: 15px 25px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border: none;
            border-radius: 8px;
            color: #000;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            text-transform: uppercase;
        }
        .send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 78, 66, 0.5);
        }
        .endpoints {
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border: 1px solid var(--panel-border);
        }
        .endpoint {
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            color: var(--accent-primary);
            font-size: 0.9em;
        }
    </style>
</head>
<body class="cinema-mode">
    <div class="grid-overlay"></div>
    <div class="scanner-frame">
        <div class="scanner-line"></div>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="title">🤖 ZENTRAW AGENT</div>
            <div class="subtitle">AI ASSISTANT - OFFICIAL INTERFACE</div>
        </div>
        
        <div class="status">
            ✅ <strong>STATUS:</strong> ONLINE | 
            🔗 <strong>VERSÃO:</strong> 1.0.0-OFFICIAL | 
            � <strong>UI:</strong> ZENTRAW CINEMA MODE |
            🤖 <strong>OPENAI:</strong> <span id="openaiStatus">CHECKING...</span>
        </div>
        
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                <div class="message assistant">
                    <strong>🤖 ZENTRAW AGENT:</strong><br>
                    SISTEMA INICIALIZADO. INTERFACE PADRÃO ZENTRAW ATIVA. OPENAI VERIFICANDO CONECTIVIDADE...
                </div>
            </div>
            
            <div class="input-container">
                <input type="text" id="messageInput" class="input-field" 
                       placeholder="DIGITE SUA MENSAGEM AQUI..." 
                       onkeypress="if(event.key==='Enter') sendMessage()">
                <button class="send-btn" onclick="sendMessage()">📤 ENVIAR</button>
            </div>
        </div>
        
        <div class="endpoints">
            <strong>📡 ENDPOINTS DISPONÍVEIS:</strong><br>
            <div class="endpoint">GET /health - HEALTH CHECK SYSTEM</div>
            <div class="endpoint">GET /zentraw-agent.js - AGENT SCRIPT</div>
            <div class="endpoint">POST /api/chat - OPENAI CHAT INTEGRATION</div>
            <div class="endpoint">POST /api/image - DALL-E 3 AUTO-REDIRECT</div>
        </div>
    </div>

    <script>
        // Verificar status OpenAI ao carregar
        window.addEventListener('load', async () => {
            try {
                const response = await fetch('/health');
                const data = await response.json();
                const statusElement = document.getElementById('openaiStatus');
                
                if (data.openai_configured) {
                    statusElement.textContent = 'CONECTADA ✅';
                    statusElement.style.color = 'var(--accent-primary)';
                } else {
                    statusElement.textContent = 'NÃO CONFIGURADA ❌';
                    statusElement.style.color = '#ff0000';
                }
            } catch (error) {
                console.error('Erro ao verificar status OpenAI:', error);
            }
        });

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const messages = document.getElementById('chatMessages');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Adicionar mensagem do usuário
            messages.innerHTML += \`
                <div class="message user">
                    <strong>👤 USUÁRIO:</strong><br>
                    \${message}
                </div>
            \`;
            
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });
                
                const data = await response.json();
                
                // Adicionar resposta do assistant
                messages.innerHTML += \`
                    <div class="message assistant">
                        <strong>🤖 ZENTRAW AGENT:</strong><br>
                        \${data.response || data.error || 'ERRO NA RESPOSTA'}
                    </div>
                \`;
                
            } catch (error) {
                messages.innerHTML += \`
                    <div class="message assistant">
                        <strong>❌ ERRO CRÍTICO:</strong><br>
                        \${error.message}
                    </div>
                \`;
            }
            
            messages.scrollTop = messages.scrollHeight;
        }
    </script>
</body>
</html>
    `);
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

// Chat endpoint com OpenAI REAL
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-4o' } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'MENSAGEM É OBRIGATÓRIA' 
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
            console.log('🎨 REDIRECIONAMENTO AUTOMÁTICO PARA DALL-E 3!');
            
            try {
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: message,
                    n: 1,
                    size: "1024x1024",
                    quality: "standard"
                });
                
                const imageUrl = imageResponse.data[0].url;
                
                return res.json({
                    success: true,
                    response: `🎨 **IMAGEM GERADA COM SUCESSO!**\n\n✅ **DALL-E 3 CONECTADO E FUNCIONANDO**\n📝 **Prompt:** "${message}"\n🖼️ **URL:** ${imageUrl}\n\n� **Status:** OpenAI DALL-E 3 totalmente operacional!`,
                    redirected: true,
                    model: 'dall-e-3',
                    image_url: imageUrl,
                    detected_keywords: imageKeywords.filter(k => message.toLowerCase().includes(k.toLowerCase())),
                    original_prompt: message,
                    auto_detection: true,
                    system_working: true,
                    openai_real: true
                });
                
            } catch (imageError) {
                console.error('❌ Erro DALL-E 3:', imageError.message);
                return res.json({
                    success: false,
                    error: `❌ **ERRO DALL-E 3:** ${imageError.message}`,
                    redirected: true,
                    model: 'dall-e-3',
                    original_prompt: message,
                    openai_attempted: true
                });
            }
        }
        
        // Chat normal com OpenAI REAL
        try {
            const completion = await openai.chat.completions.create({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "Você é o Zentraw Agent, um assistente de IA especializado em música, áudio e visualização 3D. Responda de forma útil e técnica, sempre em português brasileiro. Use formatação markdown quando apropriado."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            });
            
            const aiResponse = completion.choices[0].message.content;
            
            return res.json({
                success: true,
                response: `✅ **OPENAI CONECTADA E FUNCIONANDO!**\n\n${aiResponse}\n\n🤖 **Modelo:** ${model}\n🎨 **Redirecionamento automático:** ✅ Ativo\n🔍 **Detecção de imagem:** ✅ Funcionando\n⚡ **Status:** OpenAI totalmente operacional`,
                redirected: false,
                model: model,
                browser_test: true,
                system_status: 'fully_operational',
                openai_real: true,
                tokens_used: completion.usage?.total_tokens || 0
            });
            
        } catch (openaiError) {
            console.error('❌ Erro OpenAI Chat:', openaiError.message);
            return res.json({
                success: false,
                error: `❌ **ERRO OPENAI:** ${openaiError.message}\n\n🔧 **Possíveis causas:**\n- Chave API inválida\n- Limite de quota excedido\n- Problema de conectividade\n\n💡 **Verifique configuração .env**`,
                model: model,
                openai_attempted: true,
                error_type: openaiError.type || 'unknown'
            });
        }
        
    } catch (error) {
        console.error('❌ Erro crítico no chat:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'ERRO INTERNO CRÍTICO: ' + error.message,
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
