const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rota principal - Interface Grok
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zentraw Agent</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='14' font-size='14'%3E%F0%9F%A4%96%3C/text%3E%3C/svg%3E" />
    <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/thegoodmonolith" />
    <style>
        @import url("https://fonts.cdnfonts.com/css/thegoodmonolith");
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --bg-tertiary: #2a2a2a;
            --text-primary: #f3ede9;
            --text-secondary: #c2b8b2;
            --text-muted: #888;
            --accent-primary: #ff4e42;
            --accent-secondary: #c2362f;
            --border-color: rgba(255, 78, 66, 0.2);
            --sidebar-width: 300px;
            --sidebar-collapsed: 60px;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "TheGoodMonolith", monospace;
            background: var(--bg-primary);
            color: var(--text-primary);
            height: 100vh;
            overflow: hidden;
            text-transform: uppercase;
        }
        .app-container { display: flex; height: 100vh; }
        .sidebar {
            width: var(--sidebar-width);
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            transition: width 0.3s ease;
            overflow: hidden;
        }
        .sidebar.collapsed { width: var(--sidebar-collapsed); }
        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .sidebar-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--accent-primary);
            font-size: 18px;
            font-weight: bold;
        }
        .sidebar-toggle {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: color 0.2s ease;
        }
        .sidebar-toggle:hover { color: var(--accent-primary); }
        .sidebar-content {
            padding: 20px;
            height: calc(100vh - 80px);
            overflow-y: auto;
        }
        .sidebar.collapsed .sidebar-content { display: none; }
        .info-section { margin-bottom: 30px; }
        .info-title {
            color: var(--accent-primary);
            font-size: 14px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-color);
        }
        .info-item {
            margin-bottom: 10px;
            font-size: 12px;
            line-height: 1.4;
        }
        .info-label { color: var(--text-secondary); }
        .info-value { color: var(--text-primary); }
        .main-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--bg-primary);
        }
        .chat-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .chat-title {
            font-size: 24px;
            color: var(--accent-primary);
        }
        .model-selector {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .model-select {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-family: inherit;
            font-size: 12px;
        }
        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .welcome-message {
            text-align: center;
            color: var(--text-secondary);
            margin: auto;
            max-width: 600px;
        }
        .welcome-message h2 {
            color: var(--accent-primary);
            margin-bottom: 15px;
            font-size: 28px;
        }
        .message {
            display: flex;
            gap: 15px;
            max-width: 80%;
        }
        .message.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }
        .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .message.user .message-avatar { background: var(--accent-primary); }
        .message.assistant .message-avatar {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
        }
        .message-content {
            background: var(--bg-secondary);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            line-height: 1.5;
            font-size: 14px;
        }
        .message.user .message-content {
            background: var(--accent-primary);
            color: white;
        }
        .chat-input-container {
            padding: 20px;
            border-top: 1px solid var(--border-color);
            background: var(--bg-secondary);
        }
        .chat-input-wrapper {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
        }
        .chat-input {
            width: 100%;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 15px 60px 15px 20px;
            border-radius: 25px;
            font-family: inherit;
            font-size: 14px;
            resize: none;
            min-height: 50px;
            max-height: 120px;
            overflow-y: auto;
        }
        .chat-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }
        .chat-input::placeholder { color: var(--text-muted); }
        .send-button {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: var(--accent-primary);
            border: none;
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: background 0.2s ease;
        }
        .send-button:hover { background: var(--accent-secondary); }
        .send-button:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
        }
        @media (max-width: 768px) {
            .sidebar {
                position: absolute;
                z-index: 1000;
                height: 100vh;
                transform: translateX(-100%);
            }
            .sidebar.active { transform: translateX(0); }
            .main-area { width: 100%; }
            .message { max-width: 95%; }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <span>🤖</span>
                    <span>Zentraw</span>
                </div>
                <button class="sidebar-toggle" onclick="toggleSidebar()">
                    <span id="toggle-icon">‹</span>
                </button>
            </div>
            
            <div class="sidebar-content">
                <div class="info-section">
                    <div class="info-title">📊 Status do Sistema</div>
                    <div class="info-item">
                        <span class="info-label">Modelo:</span> 
                        <span class="info-value" id="current-model">GPT-4</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span> 
                        <span class="info-value" style="color: #4ade80;">✅ Online</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Versão:</span> 
                        <span class="info-value">v1.4.0.a.6</span>
                    </div>
                </div>

                <div class="info-section">
                    <div class="info-title">🛠️ Capacidades</div>
                    <div class="info-item">• Análise de código e debugging</div>
                    <div class="info-item">• Geração de documentação</div>
                    <div class="info-item">• Integração com APIs</div>
                    <div class="info-item">• Manipulação de arquivos</div>
                    <div class="info-item">• Execução de comandos</div>
                    <div class="info-item">• Análise de imagens</div>
                </div>

                <div class="info-section">
                    <div class="info-title">⚡ Funções OpenAI</div>
                    <div class="info-item">• Chat Completions</div>
                    <div class="info-item">• Function Calling</div>
                    <div class="info-item">• Vision (GPT-4V)</div>
                    <div class="info-item">• Code Interpreter</div>
                    <div class="info-item">• DALL-E 3</div>
                    <div class="info-item">• Whisper STT</div>
                </div>

                <div class="info-section">
                    <div class="info-title">⚙️ Configurações</div>
                    <div class="info-item">• API Key: Configurada ✅</div>
                    <div class="info-item">• Servidor: localhost:3007</div>
                    <div class="info-item">• CORS: Habilitado</div>
                    <div class="info-item">• Debug Mode: Ativo</div>
                </div>
            </div>
        </div>

        <div class="main-area">
            <div class="chat-header">
                <div class="chat-title">Zentraw Agent</div>
                <div class="model-selector">
                    <label for="model-select">Modelo:</label>
                    <select class="model-select" id="model-select">
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                </div>
            </div>

            <div class="chat-container" id="chat-container">
                <div class="welcome-message">
                    <h2>🤖 Zentraw Agent</h2>
                    <p>Bem-vindo ao assistente inteligente da Zentraw. Como posso ajudá-lo hoje?</p>
                </div>
            </div>

            <div class="chat-input-container">
                <div class="chat-input-wrapper">
                    <textarea 
                        class="chat-input" 
                        id="chat-input" 
                        placeholder="Digite sua mensagem... (Shift + Enter para nova linha)"
                        rows="1"
                    ></textarea>
                    <button class="send-button" id="send-button" onclick="sendMessage()">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        let isLoading = false;

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggleIcon = document.getElementById('toggle-icon');
            
            sidebar.classList.toggle('collapsed');
            toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
        }

        function addMessage(content, type = 'user') {
            const chatContainer = document.getElementById('chat-container');
            const welcomeMessage = chatContainer.querySelector('.welcome-message');
            
            if (welcomeMessage) {
                welcomeMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${type}\`;
            
            const avatar = type === 'user' ? '👤' : '🤖';
            
            messageDiv.innerHTML = \`
                <div class="message-avatar">\${avatar}</div>
                <div class="message-content">\${content}</div>
            \`;

            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        async function sendMessage() {
            if (isLoading) return;

            const message = document.getElementById('chat-input').value.trim();
            if (!message) return;

            const sendButton = document.getElementById('send-button');
            
            addMessage(message, 'user');
            document.getElementById('chat-input').value = '';

            isLoading = true;
            sendButton.disabled = true;

            try {
                const model = document.getElementById('model-select').value;
                
                const response = await fetch('/api/agent/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        model: model,
                        context: 'Zentraw Agent Interface'
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    addMessage(data.response, 'assistant');
                } else {
                    addMessage('❌ Erro: ' + (data.error || 'Falha na comunicação'), 'assistant');
                }
            } catch (error) {
                addMessage('❌ Erro de conexão: ' + error.message, 'assistant');
            } finally {
                isLoading = false;
                sendButton.disabled = false;
            }
        }

        document.getElementById('chat-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('chat-input').focus();
        });
    </script>
</body>
</html>
    `);
});

// Servir arquivo JavaScript do Agent
app.get('/zentraw-agent.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'zentraw-agent.js'));
});

// Zentraw Agent Chat Endpoint  
app.post('/api/agent/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-4-turbo-preview', context = null } = req.body;

        if (!message || typeof message !== 'string') {
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

        const systemPrompt = \`Você é o Zentraw Agent, um assistente de IA integrado à plataforma Zentraw.

IDENTIDADE:
- Nome: Zentraw Agent
- Versão: v1.4.0.a.6
- Plataforma: Sistema Zentraw
- Especialidade: Desenvolvimento, APIs, debugging, análise de código

CAPACIDADES DISPONÍVEIS:
- Análise de código e debugging
- Geração de documentação
- Integração com APIs
- Manipulação de arquivos
- Execução de comandos
- Análise de imagens
- Processamento de texto
- Assistência em desenvolvimento

INSTRUÇÕES:
- Seja preciso e técnico quando necessário
- Use exemplos práticos
- Mantenha o tom profissional mas acessível
- Para código, sempre explique o que faz
- Se não souber algo, seja honesto

CONTEXTO DA SESSÃO: \${context || 'Chat direto no Zentraw Agent'}\`;

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 2000,
            temperature: 0.7
        });

        const response = completion.choices[0].message.content;

        res.json({
            success: true,
            response: response,
            model: model,
            usage: completion.usage,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro no chat:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor',
            timestamp: new Date().toISOString()
        });
    }
});

// Status do Agent
app.get('/api/agent/status', (req, res) => {
    res.json({
        success: true,
        status: 'online',
        version: 'v1.4.0.a.6',
        openai_configured: !!process.env.OPENAI_API_KEY,
        model: process.env.AGENT_MODEL || 'gpt-4-turbo-preview',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(\`🤖 Zentraw Agent rodando na porta \${PORT}\`);
    console.log(\`🔗 Acesso: http://localhost:\${PORT}\`);
    console.log(\`🔑 OpenAI configurada: \${process.env.OPENAI_API_KEY ? '✅ Sim' : '❌ Não'}\`);
});

module.exports = app;
