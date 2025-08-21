const express = require('express');
const cors = require('cors');
const path = require('path');

// Configuração explícita do dotenv
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3007;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Interface simples e funcional
const simpleInterface = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zentraw Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', monospace; 
            background: #0a0a0a; 
            color: #f3ede9; 
            height: 100vh;
            display: flex;
        }
        .sidebar {
            width: 300px;
            background: #1a1a1a;
            border-right: 1px solid #ff4e42;
            padding: 20px;
            overflow-y: auto;
        }
        .main-area {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .chat-header {
            padding: 20px;
            border-bottom: 1px solid #ff4e42;
            background: #1a1a1a;
        }
        .chat-container {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        .chat-input-area {
            padding: 20px;
            border-top: 1px solid #ff4e42;
            background: #1a1a1a;
        }
        .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 8px;
        }
        .message.user {
            background: #ff4e42;
            color: white;
            text-align: right;
        }
        .message.assistant {
            background: #2a2a2a;
            border: 1px solid #ff4e42;
        }
        .input-container {
            display: flex;
            gap: 10px;
        }
        .chat-input {
            flex: 1;
            background: #2a2a2a;
            border: 1px solid #ff4e42;
            color: #f3ede9;
            padding: 10px;
            border-radius: 6px;
        }
        .send-button {
            background: #ff4e42;
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
        }
        .info-section {
            margin-bottom: 20px;
            padding: 15px;
            background: #2a2a2a;
            border-radius: 6px;
            border: 1px solid #ff4e42;
        }
        .info-title {
            color: #ff4e42;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .status-item {
            margin: 5px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="info-section">
            <div class="info-title">🤖 Zentraw Agent</div>
            <div class="status-item">Status: ✅ Online</div>
            <div class="status-item">Versão: v1.4.0.a.6</div>
            <div class="status-item">Porta: ${PORT}</div>
            <div class="status-item">OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Configurada' : '❌ Não configurada'}</div>
        </div>
        
        <div class="info-section">
            <div class="info-title">⚡ Capacidades</div>
            <div class="status-item">• Chat conversacional</div>
            <div class="status-item">• Análise de código</div>
            <div class="status-item">• Geração de documentação</div>
            <div class="status-item">• Debug e troubleshooting</div>
        </div>
        
        <div class="info-section">
            <div class="info-title">🔧 Funções OpenAI</div>
            <div class="status-item">• GPT-4 Turbo</div>
            <div class="status-item">• Function Calling</div>
            <div class="status-item">• Code Interpreter</div>
            <div class="status-item">• Vision (GPT-4V)</div>
        </div>
    </div>
    
    <div class="main-area">
        <div class="chat-header">
            <h2>💬 Zentraw Agent Chat</h2>
            <p>Assistente IA para desenvolvimento Zentraw</p>
        </div>
        
        <div class="chat-container" id="chat-container">
            <div class="message assistant">
                🤖 Olá! Sou o Zentraw Agent. Como posso ajudá-lo hoje?<br>
                💡 Posso ajudar com código, debug, documentação e análise de problemas.
            </div>
        </div>
        
        <div class="chat-input-area">
            <div class="input-container">
                <input type="text" class="chat-input" id="chat-input" placeholder="Digite sua mensagem...">
                <button class="send-button" onclick="sendMessage()">Enviar</button>
            </div>
        </div>
    </div>
    
    <script>
        const chatContainer = document.getElementById('chat-container');
        const chatInput = document.getElementById('chat-input');
        
        function addMessage(content, type = 'user') {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + type;
            messageDiv.innerHTML = content;
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            addMessage(message, 'user');
            chatInput.value = '';
            
            try {
                const response = await fetch('/api/agent/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    addMessage(data.response, 'assistant');
                } else {
                    addMessage('❌ Erro: ' + data.error, 'assistant');
                }
            } catch (error) {
                addMessage('❌ Erro de conexão: ' + error.message, 'assistant');
            }
        }
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        chatInput.focus();
    </script>
</body>
</html>
`;

// Rota principal - Interface simples
app.get('/', (req, res) => {
    res.send(simpleInterface);
});

// Servir arquivo JavaScript do Agent
app.get('/zentraw-agent.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'zentraw-agent.js'));
});

// Chat endpoint
app.post('/api/agent/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-4-turbo-preview' } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem inválida'
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'OpenAI API Key não configurada'
            });
        }

        const { OpenAI } = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const systemPrompt = "Você é o Zentraw Agent, um assistente de IA especializado na plataforma Zentraw. Ajude com desenvolvimento, debug e análise de código de forma clara e técnica.";

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const response = completion.choices[0].message.content;

        res.json({
            success: true,
            response: response,
            model: model
        });

    } catch (error) {
        console.error('❌ Erro no chat:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Status endpoint
app.get('/api/agent/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        version: 'v1.4.0.a.6',
        openai_configured: !!process.env.OPENAI_API_KEY,
        port: PORT,
        environment: 'WSL Ubuntu 22.04.4 LTS'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Zentraw Agent rodando na porta ${PORT}`);
    console.log(`🔗 Acesso: http://localhost:${PORT}`);
    console.log(`🔑 OpenAI configurada: ${process.env.OPENAI_API_KEY ? '✅ Sim' : '❌ Não'}`);
    console.log(`🐧 Ambiente: WSL Ubuntu 22.04.4 LTS`);
});

module.exports = app;
