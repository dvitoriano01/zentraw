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

// Nova Interface Zentraw Agent - Estilo Grok
const zentrawAgentInterface = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zentraw Agent - Intelligent Assistant</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='14' font-size='14'%3E🤖%3C/text%3E%3C/svg%3E">
    <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/thegoodmonolith">
    
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
            --chat-container-bg: rgba(18, 16, 15, 0.95);
            --input-bg: rgba(30, 26, 24, 0.8);
            --message-user-bg: rgba(255, 78, 66, 0.1);
            --message-assistant-bg: rgba(30, 26, 24, 0.6);
        }

        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            background: linear-gradient(135deg, #12100f 0%, #1a1815 100%);
            color: var(--text-primary); 
            font-family: "TheGoodMonolith", monospace; 
            height: 100vh; 
            overflow: hidden;
            position: relative;
        }

        /* Grid Background Animation */
        .grid-overlay { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background-image: 
                linear-gradient(var(--grid-color) 1px, transparent 1px), 
                linear-gradient(90deg, var(--grid-color) 1px, transparent 1px); 
            background-size: 50px 50px; 
            pointer-events: none; 
            z-index: 1; 
            animation: dataFlow 10s infinite linear; 
            opacity: 0.8; 
        }

        @keyframes dataFlow { 
            0% { transform: translateX(-100%); opacity: 0; } 
            50% { opacity: 1; } 
            100% { transform: translateX(100%); opacity: 0; } 
        }

        /* Scanner Frame */
        .scanner-frame { 
            position: fixed; 
            top: 20px; 
            left: 20px; 
            right: 20px; 
            bottom: 20px; 
            border: 2px solid var(--accent-primary); 
            pointer-events: none; 
            z-index: 5; 
            animation: pulseGlow 3s infinite; 
            border-radius: 4px; 
        }

        .scanner-line { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 2px; 
            background: linear-gradient(90deg, transparent, var(--accent-primary), transparent); 
            animation: scanMove 3s ease-in-out infinite; 
            opacity: 0; 
            box-shadow: 0 0 10px var(--accent-primary); 
        }

        @keyframes scanMove { 
            0%, 100% { transform: translateY(0); opacity: 0; } 
            50% { transform: translateY(calc(100vh - 80px)); opacity: 0.7; } 
        }

        @keyframes pulseGlow { 
            0%, 100% { box-shadow: 0 0 5px var(--accent-primary); } 
            50% { box-shadow: 0 0 20px var(--accent-primary), 0 0 30px var(--accent-primary); } 
        }

        /* Main Chat Container */
        .chat-main {
            position: relative;
            z-index: 10;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        /* Zentraw Logo */
        .zentraw-logo {
            margin-bottom: 40px;
            text-align: center;
            animation: logoGlow 2s ease-in-out infinite alternate;
        }

        .zentraw-logo h1 {
            font-size: 3rem;
            color: var(--accent-primary);
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 0 0 20px var(--accent-primary);
            margin-bottom: 10px;
        }

        .zentraw-logo .subtitle {
            font-size: 1rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        @keyframes logoGlow {
            0% { text-shadow: 0 0 20px var(--accent-primary); }
            100% { text-shadow: 0 0 40px var(--accent-primary), 0 0 60px var(--accent-secondary); }
        }

        /* Chat Container */
        .chat-container {
            width: 100%;
            max-width: 800px;
            height: 600px;
            background: var(--chat-container-bg);
            border: 2px solid var(--panel-border);
            border-radius: 20px;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Messages Area */
        .messages-area {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .messages-area::-webkit-scrollbar {
            width: 8px;
        }

        .messages-area::-webkit-scrollbar-track {
            background: rgba(255, 78, 66, 0.1);
            border-radius: 4px;
        }

        .messages-area::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }

        /* Message Bubbles */
        .message {
            max-width: 70%;
            padding: 15px 20px;
            border-radius: 16px;
            font-size: 0.95rem;
            line-height: 1.4;
            animation: messageSlide 0.3s ease-out;
        }

        .message.user {
            align-self: flex-end;
            background: var(--message-user-bg);
            border: 1px solid var(--panel-border);
            color: var(--text-primary);
        }

        .message.assistant {
            align-self: flex-start;
            background: var(--message-assistant-bg);
            border: 1px solid var(--panel-border);
            color: var(--text-primary);
        }

        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Input Container */
        .input-container {
            padding: 20px;
            border-top: 1px solid var(--panel-border);
            background: rgba(0, 0, 0, 0.2);
        }

        .input-wrapper {
            display: flex;
            align-items: center;
            background: var(--input-bg);
            border: 2px solid var(--panel-border);
            border-radius: 24px;
            padding: 12px 20px;
            transition: all 0.3s ease;
        }

        .input-wrapper:focus-within {
            border-color: var(--accent-primary);
            box-shadow: 0 0 20px rgba(255, 78, 66, 0.3);
        }

        .attach-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            margin-right: 12px;
            padding: 4px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .attach-btn:hover {
            color: var(--accent-primary);
            background: rgba(255, 78, 66, 0.1);
        }

        .message-input {
            flex: 1;
            background: none;
            border: none;
            color: var(--text-primary);
            font-family: inherit;
            font-size: 1rem;
            outline: none;
            resize: none;
            min-height: 24px;
            max-height: 120px;
        }

        .message-input::placeholder {
            color: var(--text-secondary);
        }

        .send-btn {
            background: linear-gradient(145deg, var(--accent-secondary), var(--accent-primary));
            border: none;
            color: var(--text-primary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 50%;
            margin-left: 12px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .send-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(255, 78, 66, 0.4);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        /* Loading Animation */
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-style: italic;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: var(--accent-primary);
            border-radius: 50%;
            animation: typingBounce 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        /* File Upload */
        .file-input {
            display: none;
        }

        /* Welcome Message */
        .welcome-message {
            text-align: center;
            color: var(--text-secondary);
            font-style: italic;
            margin: 20px 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .zentraw-logo h1 {
                font-size: 2rem;
            }
            
            .chat-container {
                max-width: 95%;
                height: 70vh;
            }
            
            .message {
                max-width: 85%;
            }
        }
    </style>
</head>
<body>
    <div class="grid-overlay"></div>
    <div class="scanner-frame">
        <div class="scanner-line"></div>
    </div>

    <div class="chat-main">
        <!-- Zentraw Logo -->
        <div class="zentraw-logo">
            <h1>Zentraw</h1>
            <div class="subtitle">Intelligent Agent</div>
        </div>

        <!-- Chat Container -->
        <div class="chat-container">
            <!-- Messages Area -->
            <div class="messages-area" id="messagesArea">
                <div class="welcome-message">
                    Olá! Sou o Zentraw Agent. Como posso ajudá-lo hoje?
                </div>
            </div>

            <!-- Input Container -->
            <div class="input-container">
                <div class="input-wrapper">
                    <button class="attach-btn" onclick="document.getElementById('fileInput').click()" title="Anexar arquivo">
                        📎
                    </button>
                    <input type="file" id="fileInput" class="file-input" multiple accept="image/*,audio/*,.txt,.json,.md">
                    <textarea 
                        class="message-input" 
                        id="messageInput" 
                        placeholder="O que você quer saber?"
                        rows="1"
                        onkeydown="handleKeyDown(event)"
                        oninput="autoResize(this)"
                    ></textarea>
                    <button class="send-btn" id="sendBtn" onclick="sendMessage()">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script>
        const messagesArea = document.getElementById('messagesArea');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const fileInput = document.getElementById('fileInput');

        // Auto-resize textarea
        function autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }

        // Handle enter key
        function handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        // Add message to chat
        function addMessage(content, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${isUser ? 'user' : 'assistant'}\`;
            messageDiv.textContent = content;
            messagesArea.appendChild(messageDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        // Add typing indicator
        function addTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = \`
                Zentraw Agent está digitando
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            \`;
            messagesArea.appendChild(typingDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        // Remove typing indicator
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Send message
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, true);
            messageInput.value = '';
            messageInput.style.height = 'auto';

            // Disable send button
            sendBtn.disabled = true;

            // Add typing indicator
            addTypingIndicator();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                
                // Remove typing indicator
                removeTypingIndicator();

                if (data.success) {
                    addMessage(data.response);
                } else {
                    addMessage('Desculpe, ocorreu um erro. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro:', error);
                removeTypingIndicator();
                addMessage('Erro de conexão. Verifique sua internet e tente novamente.');
            } finally {
                sendBtn.disabled = false;
            }
        }

        // File upload handling
        fileInput.addEventListener('change', function(event) {
            const files = event.target.files;
            if (files.length > 0) {
                const fileNames = Array.from(files).map(file => file.name).join(', ');
                addMessage(\`Arquivos anexados: \${fileNames}\`, true);
                
                // TODO: Implement file upload logic
                addMessage('Funcionalidade de upload de arquivos será implementada em breve.');
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            messageInput.focus();
            
            // Remove welcome message after first interaction
            messageInput.addEventListener('focus', function() {
                const welcomeMessage = document.querySelector('.welcome-message');
                if (welcomeMessage) {
                    setTimeout(() => {
                        welcomeMessage.style.opacity = '0.5';
                    }, 2000);
                }
            }, { once: true });
        });
    </script>
</body>
</html>
`;

// Rota principal do Agent
app.get('/', (req, res) => {
    res.send(zentrawAgentInterface);
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mensagem é obrigatória' 
            });
        }

        // Simulação de resposta do OpenAI
        // TODO: Implementar integração real com OpenAI
        
        const responses = [
            "Entendo sua pergunta. Como Zentraw Agent, posso ajudá-lo com análise de dados, geração de código e muito mais.",
            "Interessante! Deixe-me processar isso e fornecer uma resposta detalhada.",
            "Baseado na sua solicitação, posso sugerir algumas abordagens técnicas para resolver isso.",
            "Como agente especializado em desenvolvimento, vou analisar sua questão e propor soluções práticas."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Simulação de delay para parecer mais natural
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        res.json({
            success: true,
            response: randomResponse
        });
        
    } catch (error) {
        console.error('Erro no chat:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Zentraw Agent',
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🤖 Zentraw Agent rodando na porta', PORT);
    console.log('🔗 Acesso: http://localhost:' + PORT);
    console.log('🔑 OpenAI configurada:', process.env.OPENAI_API_KEY ? '✅ Sim' : '❌ Não');
    console.log('🐧 Ambiente: WSL Ubuntu 22.04.4 LTS');
});
