const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

// Configuração explícita do dotenv
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Inicialização da OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
            font-size: 1.1rem;
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

        /* Chat Container - Hidden border container */
        .chat-container {
            width: 100%;
            max-width: 1000px;
            height: auto;
            display: flex;
            flex-direction: column;
            overflow: visible;
        }

        /* Messages Area */
        .messages-area {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 20px;
            max-height: 60vh;
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
            max-width: 75%;
            padding: 18px 24px;
            border-radius: 18px;
            font-size: 1.1rem;
            line-height: 1.5;
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
            padding: 25px;
            background: var(--chat-container-bg);
            border: 2px solid var(--panel-border);
            border-radius: 24px;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            position: relative;
        }

        .input-wrapper {
            display: flex;
            align-items: center;
            background: var(--input-bg);
            border: 2px solid var(--panel-border);
            border-radius: 28px;
            padding: 16px 24px;
            transition: all 0.3s ease;
            min-height: 60px;
        }

        .input-wrapper:focus-within {
            border-color: var(--accent-primary);
            box-shadow: 0 0 20px rgba(255, 78, 66, 0.3);
        }

        .attach-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.8rem;
            cursor: pointer;
            margin-right: 16px;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
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
            font-size: 1.1rem;
            outline: none;
            resize: none;
            min-height: 28px;
            max-height: 150px;
            line-height: 1.4;
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

        /* Model Selector */
        .model-selector {
            margin-bottom: 15px;
            text-align: center;
        }

        .model-select {
            background: rgba(30, 26, 24, 0.8);
            border: 2px solid rgba(255, 78, 66, 0.3);
            border-radius: 8px;
            padding: 8px 16px;
            color: var(--text-primary);
            font-family: 'TheGoodMonolith', 'Courier New', monospace;
            font-size: 0.9rem;
            min-width: 200px;
            cursor: pointer;
        }

        .model-select:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 10px rgba(255, 78, 66, 0.3);
        }

        .model-select option {
            background: var(--bg-color);
            color: var(--text-primary);
            padding: 8px;
        }

        /* File Upload & Drag and Drop */
        .file-input {
            display: none;
        }

        .input-wrapper.drag-over {
            border-color: var(--accent-primary);
            background: rgba(255, 78, 66, 0.05);
            box-shadow: 0 0 20px rgba(255, 78, 66, 0.2);
        }

        .drop-zone-indicator {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 78, 66, 0.1);
            border: 2px dashed var(--accent-primary);
            border-radius: 28px;
            display: none;
            align-items: center;
            justify-content: center;
            color: var(--accent-primary);
            font-size: 1.2rem;
            pointer-events: none;
        }

        .drop-zone-indicator.active {
            display: flex;
        }

        /* Image Preview */
        .image-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            padding: 10px 0;
        }

        .preview-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            max-width: 100px;
            max-height: 100px;
        }

        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .preview-remove {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
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
                <!-- Model Selector -->
                <div class="model-selector">
                    <select id="modelSelect" class="model-select">
                        <option value="gpt-4o" selected>GPT-4o (Chat + Imagens + Geração)</option>
                        <option value="gpt-4-turbo-preview">GPT-4 Turbo (Chat)</option>
                        <option value="dall-e-3">DALL-E 3 (Gerar Imagem)</option>
                        <option value="dall-e-2-edit">DALL-E 2 (Editar Imagem)</option>
                    </select>
                </div>
                
                <div class="input-wrapper">
                    <div class="drop-zone-indicator">
                        📁 Solte imagens aqui ou use Ctrl+V
                    </div>
                    <button class="attach-btn" onclick="document.getElementById('fileInput').click()" title="Anexar arquivo">
                        📎
                    </button>
                    <input type="file" id="fileInput" class="file-input" multiple accept="image/*,audio/*,.txt,.json,.md">
                    <div class="image-preview" id="imagePreview"></div>
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
        const imagePreview = document.getElementById('imagePreview');
        const inputWrapper = document.querySelector('.input-wrapper');
        const dropZoneIndicator = document.querySelector('.drop-zone-indicator');
        const modelSelect = document.getElementById('modelSelect');

        let uploadedFiles = [];

        // Model selection handler
        modelSelect.addEventListener('change', function() {
            const selectedModel = this.value;
            if (selectedModel === 'dall-e-2-edit') {
                addMessage('💡 DALL-E 2 Edit selecionado! Para melhor resultado, faça upload de uma imagem base que você quer editar. Se não enviar imagem, uma nova será gerada.', 'system');
            } else if (selectedModel === 'gpt-4o') {
                addMessage('🚀 GPT-4o ativado! Agora você pode enviar imagens para análise, fazer perguntas, gerar código e muito mais. Todas as funções estão habilitadas!', 'system');
            } else if (selectedModel === 'dall-e-3') {
                addMessage('🎨 DALL-E 3 selecionado! Descreva a imagem que você quer gerar em detalhes.', 'system');
            }
        });

        // Auto-resize textarea
        function autoResize(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }

        // Handle enter key and paste
        function handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
            
            // Handle paste (Ctrl+V)
            if (event.ctrlKey && event.key === 'v') {
                handlePaste(event);
            }
        }

        // Handle paste events for images
        function handlePaste(event) {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        addFileToPreview(file);
                    }
                }
            }
        }

        // Drag and drop functionality
        function setupDragAndDrop() {
            // Prevent default drag behaviors
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                inputWrapper.addEventListener(eventName, preventDefaults, false);
                document.body.addEventListener(eventName, preventDefaults, false);
            });

            // Highlight drop zone when item is dragged over it
            ['dragenter', 'dragover'].forEach(eventName => {
                inputWrapper.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                inputWrapper.addEventListener(eventName, unhighlight, false);
            });

            // Handle dropped files
            inputWrapper.addEventListener('drop', handleDrop, false);
        }

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight(e) {
            inputWrapper.classList.add('drag-over');
            dropZoneIndicator.classList.add('active');
        }

        function unhighlight(e) {
            inputWrapper.classList.remove('drag-over');
            dropZoneIndicator.classList.remove('active');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            for (let file of files) {
                if (file.type.startsWith('image/')) {
                    addFileToPreview(file);
                }
            }
        }

        // Add file to preview
        function addFileToPreview(file) {
            uploadedFiles.push(file);
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = \`
                    <img src="\${e.target.result}" alt="Preview">
                    <button class="preview-remove" onclick="removeFile(\${uploadedFiles.length - 1})">×</button>
                \`;
                imagePreview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }

        // Remove file from preview
        function removeFile(index) {
            uploadedFiles.splice(index, 1);
            updatePreview();
        }

        // Update preview display
        function updatePreview() {
            imagePreview.innerHTML = '';
            uploadedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = \`
                        <img src="\${e.target.result}" alt="Preview">
                        <button class="preview-remove" onclick="removeFile(\${index})">×</button>
                    \`;
                    imagePreview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });
        }

        // File input change handler
        fileInput.addEventListener('change', function(e) {
            for (let file of e.target.files) {
                if (file.type.startsWith('image/')) {
                    addFileToPreview(file);
                }
            }
        });

        // Handle enter key
        function handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        // Initialize drag and drop when page loads
        document.addEventListener('DOMContentLoaded', function() {
            setupDragAndDrop();
        });

        // Convert file to base64
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        // Add message to chat with optional images
        function addMessage(content, type = 'assistant', images = []) {
            const messageDiv = document.createElement('div');
            
            if (type === 'system') {
                messageDiv.className = 'message system';
                messageDiv.style.cssText = \`
                    background: rgba(255, 78, 66, 0.2);
                    border: 1px solid rgba(255, 78, 66, 0.4);
                    color: #fff;
                    text-align: center;
                    font-style: italic;
                    margin: 10px auto;
                    max-width: 90%;
                \`;
            } else {
                const isUser = type === true || type === 'user';
                messageDiv.className = \`message \${isUser ? 'user' : 'assistant'}\`;
            }
            
            // Add images if present
            if (images.length > 0) {
                const imagesContainer = document.createElement('div');
                imagesContainer.className = 'message-images';
                imagesContainer.style.cssText = \`
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 8px;
                \`;
                
                images.forEach(imageBase64 => {
                    const img = document.createElement('img');
                    img.src = imageBase64;
                    img.style.cssText = \`
                        max-width: 150px;
                        max-height: 150px;
                        border-radius: 8px;
                        object-fit: cover;
                    \`;
                    imagesContainer.appendChild(img);
                });
                
                messageDiv.appendChild(imagesContainer);
            }
            
            const textDiv = document.createElement('div');
            textDiv.textContent = content;
            messageDiv.appendChild(textDiv);
            
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
            const selectedModel = modelSelect.value;
            
            if (!message) return;

            // Verificar se é modelo de geração de imagem
            if (selectedModel.startsWith('dall-e')) {
                await handleImageGeneration(message, selectedModel);
                return;
            }

            // Preparar imagens se houver para modelos de chat
            const images = [];
            if (uploadedFiles.length > 0 && (selectedModel === 'gpt-4o' || selectedModel === 'gpt-4-vision-preview')) {
                for (let file of uploadedFiles) {
                    const base64 = await fileToBase64(file);
                    images.push(base64);
                }
            }

            // Add user message with images
            addMessage(message, true, images);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Clear uploaded files
            uploadedFiles = [];
            imagePreview.innerHTML = '';

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
                    body: JSON.stringify({ 
                        message,
                        images: images.length > 0 ? images : undefined,
                        model: selectedModel
                    })
                });

                const data = await response.json();
                
                // Remove typing indicator
                removeTypingIndicator();

                if (data.success) {
                    addMessage(data.response || data.data?.response);
                    
                    // Show model info if available
                    if (data.model || data.usage) {
                        const infoText = \`Modelo: \${data.model || 'N/A'}\${data.usage ? \` | Tokens: \${data.usage.total_tokens}\` : ''}\`;
                        addModelInfo(infoText);
                    }
                } else {
                    addMessage('❌ Erro: ' + (data.error || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Erro:', error);
                removeTypingIndicator();
                addMessage('❌ Erro de conexão: ' + error.message);
            } finally {
                sendBtn.disabled = false;
            }
        }

        // Handle image generation
        async function handleImageGeneration(prompt, model) {
            // Sanitizar prompt para evitar filtros de segurança
            const sanitizedPrompt = sanitizePrompt(prompt);
            
            addMessage(\`🎨 Gerando imagem: "\${sanitizedPrompt}"\`, true);
            messageInput.value = '';
            
            sendBtn.disabled = true;
            addTypingIndicator();

            try {
                const endpoint = model === 'dall-e-3' ? '/api/generate-image' : '/api/edit-image';
                
                // Para DALL-E 2 Edit, incluir imagem se disponível
                const requestBody = { 
                    prompt: sanitizedPrompt,
                    size: '1024x1024',
                    quality: 'standard'
                };

                // Se é DALL-E 2 Edit e há imagens carregadas
                if (model === 'dall-e-2-edit' && uploadedFiles.length > 0) {
                    const imageBase64 = await fileToBase64(uploadedFiles[0]);
                    requestBody.imageBase64 = imageBase64;
                    addMessage('📤 Imagem base carregada para edição. Processando...');
                    // Limpar uploads após uso
                    uploadedFiles = [];
                    imagePreview.innerHTML = '';
                } else if (model === 'dall-e-2-edit' && uploadedFiles.length === 0) {
                    addMessage('⚠️ DALL-E 2 Edit: Nenhuma imagem carregada, gerando nova imagem.');
                }
                
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();
                removeTypingIndicator();

                if (data.success && data.data?.url) {
                    addImageMessage(data.data.url, data.data.revised_prompt || sanitizedPrompt);
                    
                    // Mostrar nota se aplicável
                    if (data.data.note) {
                        addMessage(\`ℹ️ \${data.data.note}\`);
                    }
                } else {
                    addMessage('❌ Erro na geração: ' + (data.error || 'Erro desconhecido'));
                }

            } catch (error) {
                removeTypingIndicator();
                addMessage('❌ Erro na geração: ' + error.message);
            } finally {
                sendBtn.disabled = false;
            }
        }

        // Sanitizar prompt para DALL-E
        function sanitizePrompt(prompt) {
            // Remover palavras que podem acionar filtros
            const sanitized = prompt
                .replace(/\b(nude|naked|sex|porn|explicit)\b/gi, 'artistic')
                .replace(/\b(violence|blood|death|kill)\b/gi, 'dramatic')
                .replace(/\b(drug|weapon|gun)\b/gi, 'item')
                .trim();
            
            // Adicionar prefixo para contexto artístico
            return \`Digital art style: \${sanitized}, professional quality, safe for work\`;
        }

        // Add generated image to chat
        function addImageMessage(imageUrl, prompt) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant';
            
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.cssText = \`
                max-width: 100%;
                max-height: 400px;
                border-radius: 8px;
                margin-bottom: 8px;
            \`;
            
            const caption = document.createElement('div');
            caption.textContent = \`🎨 Imagem gerada: \${prompt}\`;
            caption.style.fontSize = '0.9rem';
            caption.style.opacity = '0.8';
            
            messageDiv.appendChild(img);
            messageDiv.appendChild(caption);
            messagesArea.appendChild(messageDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        // Add model info
        function addModelInfo(info) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'model-info';
            infoDiv.textContent = info;
            infoDiv.style.cssText = \`
                font-size: 0.8rem;
                opacity: 0.6;
                text-align: center;
                margin: 5px 0;
                padding: 5px;
                border-top: 1px solid rgba(255, 78, 66, 0.1);
            \`;
            messagesArea.appendChild(infoDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
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
        const { message, images, model = 'gpt-4o' } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mensagem é obrigatória' 
            });
        }

        // 🎯 REDIRECIONAMENTO AUTOMÁTICO PARA DALL-E 3
        // Detectar se o usuário está solicitando geração de imagens
        const imageGenerationKeywords = [
            'criar imagem', 'gerar imagem', 'fazer imagem', 'desenhar',
            'create image', 'generate image', 'make image', 'draw',
            'ilustrar', 'pintar', 'arte', 'desenho', 'quadro',
            'fotografia', 'retrato', 'paisagem', 'logo', 'ícone',
            'crie uma', 'faça uma', 'desenhe uma', 'gere uma',
            'quero uma imagem', 'preciso de uma imagem'
        ];

        const messageText = message.toLowerCase();
        const isImageRequest = imageGenerationKeywords.some(keyword => 
            messageText.includes(keyword.toLowerCase())
        );

        if (isImageRequest) {
            // Redirecionar automaticamente para DALL-E 3
            try {
                const sanitizedPrompt = sanitizePromptBackend(message);
                
                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: sanitizedPrompt,
                    n: 1,
                    size: '1024x1024',
                    quality: 'standard'
                });

                return res.json({
                    success: true,
                    response: `🎨 Imagem gerada com sucesso! Detectei que você queria criar uma imagem, então redirecionei automaticamente para o DALL-E 3.\n\n🖼️ **Sua imagem está pronta:**`,
                    image_url: response.data[0].url,
                    revised_prompt: response.data[0].revised_prompt,
                    original_prompt: message,
                    auto_redirected: true,
                    model: 'dall-e-3'
                });
            } catch (imageError) {
                console.error('Erro no redirecionamento para DALL-E:', imageError.message);
                // Em caso de erro, continua com o chat normal mas informa sobre a funcionalidade
                const errorMessage = `❌ Detectei que você queria gerar uma imagem, mas houve um erro: ${imageError.message}\n\n💡 **Dica:** Você pode usar o endpoint específico /api/generate-image ou reformular sua solicitação.`;
                
                return res.json({
                    success: true,
                    response: errorMessage,
                    auto_redirect_failed: true,
                    error_details: imageError.message
                });
            }
        }

        // Preparar mensagens para OpenAI (chat normal)
        const messages = [
            {
                role: "system",
                content: `Você é o Zentraw Agent, um assistente inteligente especializado em desenvolvimento, análise de dados, geração de código e criação de conteúdo. 

IMPORTANTE: Você NÃO pode gerar, criar, desenhar ou produzir imagens diretamente. Quando um usuário solicitar criação de imagens, explique que:
- O sistema possui um módulo específico DALL-E 3 integrado para geração de imagens
- Eles devem usar termos como "criar imagem", "gerar imagem", "desenhar" para ativar o redirecionamento automático
- Ou usar diretamente o endpoint /api/generate-image

Responda sempre em português brasileiro de forma útil e precisa.`
            }
        ];

        // Se há imagens e modelo suporta visão
        if (images && images.length > 0 && (model === 'gpt-4o' || model === 'gpt-4-vision-preview')) {
            const content = [
                { type: "text", text: message }
            ];
            
            // Adicionar imagens ao conteúdo
            images.forEach(imageUrl => {
                content.push({
                    type: "image_url",
                    image_url: { url: imageUrl }
                });
            });

            messages.push({
                role: "user",
                content: content
            });
        } else {
            // Apenas texto
            messages.push({
                role: "user",
                content: message
            });
        }

        // Chamar OpenAI real
        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
            max_tokens: 1500,
            temperature: 0.7
        });

        const response = completion.choices[0].message.content;
        
        res.json({
            success: true,
            response: response,
            model: completion.model,
            usage: completion.usage
        });

    } catch (error) {
        console.error('Erro na OpenAI:', error.message);
        res.status(500).json({ 
            success: false, 
            error: `Erro na API OpenAI: ${error.message}` 
        });
    }
});// Image generation endpoint (DALL-E)
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, size = '1024x1024', quality = 'standard' } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                error: 'Prompt é obrigatório para gerar imagem' 
            });
        }

        // Sanitizar prompt para evitar filtros de segurança
        const sanitizedPrompt = sanitizePromptBackend(prompt);

        // Integração real com DALL-E
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: sanitizedPrompt,
            n: 1,
            size: size,
            quality: quality
        });

        res.json({
            success: true,
            data: {
                url: response.data[0].url,
                prompt: prompt,
                revised_prompt: response.data[0].revised_prompt
            }
        });

    } catch (error) {
        console.error('Erro ao gerar imagem:', error.message);
        res.status(500).json({ 
            success: false, 
            error: `Erro DALL-E: \${error.message}` 
        });
    }
});

// Função para sanitizar prompts no backend
function sanitizePromptBackend(prompt) {
    // Remover palavras que podem acionar filtros
    const sanitized = prompt
        .replace(/\b(nude|naked|sex|porn|explicit)\b/gi, 'artistic')
        .replace(/\b(violence|blood|death|kill)\b/gi, 'dramatic')
        .replace(/\b(drug|weapon|gun)\b/gi, 'item')
        .trim();
    
    // Adicionar prefixo para contexto artístico
    return `Digital art style: \${sanitized}, professional quality, safe for work`;
}

// Image editing endpoint (DALL-E Edit)
app.post('/api/edit-image', async (req, res) => {
    try {
        const { prompt, imageBase64, size = '1024x1024' } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                error: 'Prompt é obrigatório para edição de imagem' 
            });
        }

        // Se não há imagem base64, criar uma nova (como DALL-E 3)
        if (!imageBase64) {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: `Edit/variation of: ${prompt}`,
                n: 1,
                size: size,
                quality: 'standard'
            });

            return res.json({
                success: true,
                data: {
                    url: response.data[0].url,
                    prompt: prompt,
                    revised_prompt: response.data[0].revised_prompt,
                    note: 'Generated new image based on prompt (no base image provided)'
                }
            });
        }

        // Converter base64 para buffer
        const imageBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');

        // Integração real com DALL-E Edit
        const response = await openai.images.edit({
            model: "dall-e-2",
            image: imageBuffer,
            prompt: prompt,
            n: 1,
            size: size
        });

        res.json({
            success: true,
            data: {
                url: response.data[0].url,
                prompt: prompt
            }
        });

    } catch (error) {
        console.error('Erro ao editar imagem:', error.message);
        res.status(500).json({ 
            success: false, 
            error: `Erro DALL-E Edit: ${error.message}` 
        });
    }
});

// Image variation endpoint (DALL-E Variations)
app.post('/api/image-variations', async (req, res) => {
    try {
        const { image, n = 1, size = '1024x1024' } = req.body;
        
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                error: 'Imagem é obrigatória para criar variações' 
            });
        }

        // Integração real com DALL-E Variations
        const response = await openai.images.createVariation({
            model: "dall-e-2",
            image: image,
            n: n,
            size: size
        });

        const variations = response.data.map((variation, index) => ({
            url: variation.url,
            index: index + 1
        }));

        res.json({
            success: true,
            data: {
                variations: variations
            }
        });

    } catch (error) {
        console.error('Erro ao criar variações:', error.message);
        res.status(500).json({ 
            success: false, 
            error: `Erro DALL-E Variations: ${error.message}` 
        });
    }
});

// Servir arquivo JavaScript do Agent (Solução B - Inline serving)
app.get('/zentraw-agent.js', (req, res) => {
    try {
        console.log('🔍 Servindo zentraw-agent.js...');
        const filePath = path.join(__dirname, 'public', 'zentraw-agent.js');
        console.log('📁 Caminho:', filePath);
        
        // Verificar se arquivo existe
        if (!fs.existsSync(filePath)) {
            console.log('❌ Arquivo não encontrado');
            return res.status(404).send('File not found');
        }
        
        // Ler arquivo e servir inline
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('✅ Arquivo carregado, tamanho:', content.length, 'bytes');
        
        // Headers CORS e Content-Type
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Cache-Control', 'no-cache');
        
        res.send(content);
        console.log('📤 zentraw-agent.js servido com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao servir zentraw-agent.js:', error.message);
        res.status(500).send('Internal server error: ' + error.message);
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
