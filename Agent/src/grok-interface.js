// Nova interface estilo Grok para o Zentraw Agent
const grokInterface = `
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

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "TheGoodMonolith", monospace;
            background: var(--bg-primary);
            color: var(--text-primary);
            height: 100vh;
            overflow: hidden;
            text-transform: uppercase;
        }

        .app-container {
            display: flex;
            height: 100vh;
        }

        /* SIDEBAR */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--bg-secondary);
            border-right: 1px solid var(--border-color);
            transition: width 0.3s ease;
            overflow: hidden;
            position: relative;
        }

        .sidebar.collapsed {
            width: var(--sidebar-collapsed);
        }

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

        .sidebar-toggle:hover {
            color: var(--accent-primary);
        }

        .sidebar-content {
            padding: 20px;
            height: calc(100vh - 80px);
            overflow-y: auto;
        }

        .sidebar.collapsed .sidebar-content {
            display: none;
        }

        .info-section {
            margin-bottom: 30px;
        }

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

        .info-label {
            color: var(--text-secondary);
        }

        .info-value {
            color: var(--text-primary);
        }

        .dropdown-section {
            margin-bottom: 20px;
        }

        .dropdown-trigger {
            width: 100%;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            font-family: inherit;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease;
        }

        .dropdown-trigger:hover {
            border-color: var(--accent-primary);
        }

        .dropdown-content {
            margin-top: 10px;
            padding: 15px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            font-size: 11px;
            line-height: 1.4;
            display: none;
        }

        .dropdown-content.active {
            display: block;
        }

        /* MAIN CHAT AREA */
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

        .message.user .message-avatar {
            background: var(--accent-primary);
        }

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

        /* CHAT INPUT */
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

        .chat-input::placeholder {
            color: var(--text-muted);
        }

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

        .send-button:hover {
            background: var(--accent-secondary);
        }

        .send-button:disabled {
            background: var(--text-muted);
            cursor: not-allowed;
        }

        /* FUNCTION TOOLS */
        .function-tools {
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .function-tool {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .function-tool:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }

        .loading {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-secondary);
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent-primary);
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .sidebar {
                position: absolute;
                z-index: 1000;
                height: 100vh;
                transform: translateX(-100%);
            }

            .sidebar.active {
                transform: translateX(0);
            }

            .main-area {
                width: 100%;
            }

            .message {
                max-width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
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
                <!-- Informações do Sistema -->
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

                <!-- Dropdown: Capacidades -->
                <div class="dropdown-section">
                    <button class="dropdown-trigger" onclick="toggleDropdown('capabilities')">
                        🛠️ Capacidades
                        <span id="capabilities-arrow">▼</span>
                    </button>
                    <div class="dropdown-content" id="capabilities-content">
                        <div>• Análise de código e debugging</div>
                        <div>• Geração de documentação</div>
                        <div>• Integração com APIs</div>
                        <div>• Manipulação de arquivos</div>
                        <div>• Execução de comandos</div>
                        <div>• Análise de imagens</div>
                        <div>• Processamento de texto</div>
                    </div>
                </div>

                <!-- Dropdown: Funções Disponíveis -->
                <div class="dropdown-section">
                    <button class="dropdown-trigger" onclick="toggleDropdown('functions')">
                        ⚡ Funções OpenAI
                        <span id="functions-arrow">▼</span>
                    </button>
                    <div class="dropdown-content" id="functions-content">
                        <div id="available-functions">
                            Carregando funções disponíveis...
                        </div>
                    </div>
                </div>

                <!-- Dropdown: Histórico -->
                <div class="dropdown-section">
                    <button class="dropdown-trigger" onclick="toggleDropdown('history')">
                        📝 Histórico Recente
                        <span id="history-arrow">▼</span>
                    </button>
                    <div class="dropdown-content" id="history-content">
                        <div>• Sessão anterior: 21/08/2025</div>
                        <div>• Debugging Agent interface</div>
                        <div>• Correção duplicações Admin Panel</div>
                        <div>• Implementação chat interface</div>
                    </div>
                </div>

                <!-- Dropdown: Configurações -->
                <div class="dropdown-section">
                    <button class="dropdown-trigger" onclick="toggleDropdown('settings')">
                        ⚙️ Configurações
                        <span id="settings-arrow">▼</span>
                    </button>
                    <div class="dropdown-content" id="settings-content">
                        <div>• API Key: Configurada ✅</div>
                        <div>• Servidor: localhost:3007</div>
                        <div>• CORS: Habilitado</div>
                        <div>• Debug Mode: Ativo</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Chat Area -->
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
                    
                    <div class="function-tools">
                        <div class="function-tool" onclick="insertPrompt('Analise o código do projeto')">📝 Analisar Código</div>
                        <div class="function-tool" onclick="insertPrompt('Execute testes do sistema')">🧪 Executar Testes</div>
                        <div class="function-tool" onclick="insertPrompt('Gerar documentação')">📚 Documentação</div>
                        <div class="function-tool" onclick="insertPrompt('Verificar APIs')">🔗 Verificar APIs</div>
                        <div class="function-tool" onclick="insertPrompt('Debug de erro')">🐛 Debug</div>
                        <div class="function-tool" onclick="insertPrompt('Otimizar performance')">⚡ Otimizar</div>
                    </div>
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

        // Auto-resize textarea
        const chatInput = document.getElementById('chat-input');
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Send message on Enter
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Sidebar toggle
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const toggleIcon = document.getElementById('toggle-icon');
            
            sidebar.classList.toggle('collapsed');
            toggleIcon.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
        }

        // Dropdown toggle
        function toggleDropdown(id) {
            const content = document.getElementById(id + '-content');
            const arrow = document.getElementById(id + '-arrow');
            
            content.classList.toggle('active');
            arrow.textContent = content.classList.contains('active') ? '▲' : '▼';
        }

        // Insert prompt
        function insertPrompt(text) {
            chatInput.value = text;
            chatInput.focus();
        }

        // Add message to chat
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

        // Show loading
        function showLoading() {
            const chatContainer = document.getElementById('chat-container');
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message assistant loading';
            loadingDiv.id = 'loading-message';
            
            loadingDiv.innerHTML = \`
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                    Processando...
                </div>
            \`;

            chatContainer.appendChild(loadingDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Remove loading
        function removeLoading() {
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.remove();
            }
        }

        // Send message
        async function sendMessage() {
            if (isLoading) return;

            const message = chatInput.value.trim();
            if (!message) return;

            const sendButton = document.getElementById('send-button');
            
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            chatInput.style.height = 'auto';

            // Show loading
            isLoading = true;
            sendButton.disabled = true;
            showLoading();

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

                removeLoading();

                if (data.success) {
                    addMessage(data.response, 'assistant');
                } else {
                    addMessage('❌ Erro: ' + (data.error || 'Falha na comunicação'), 'assistant');
                }
            } catch (error) {
                removeLoading();
                addMessage('❌ Erro de conexão: ' + error.message, 'assistant');
            } finally {
                isLoading = false;
                sendButton.disabled = false;
                chatInput.focus();
            }
        }

        // Load available functions
        async function loadAvailableFunctions() {
            try {
                const response = await fetch('/api/agent/functions');
                const data = await response.json();
                
                const functionsContent = document.getElementById('available-functions');
                
                if (data.success && data.functions) {
                    functionsContent.innerHTML = data.functions.map(fn => 
                        \`<div>• \${fn.name}: \${fn.description}</div>\`
                    ).join('');
                } else {
                    functionsContent.innerHTML = 'Nenhuma função disponível';
                }
            } catch (error) {
                document.getElementById('available-functions').innerHTML = 'Erro ao carregar funções';
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadAvailableFunctions();
            chatInput.focus();
        });
    </script>
</body>
</html>
`;

module.exports = grokInterface;
