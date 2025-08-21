const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota principal do Agent
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🤖 Zentraw Agent</title>
            <style>
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    background: linear-gradient(135deg, #12100f, #1a1815); 
                    color: #f3ede9; 
                    margin: 0; 
                    padding: 20px; 
                    min-height: 100vh;
                }
                .container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    height: calc(100vh - 40px);
                }
                .info-panel {
                    background: rgba(255,78,66,0.1); 
                    padding: 30px; 
                    border-radius: 16px; 
                    border: 2px solid #ff4e42;
                    overflow-y: auto;
                }
                .chat-panel {
                    background: rgba(255,78,66,0.1); 
                    padding: 0; 
                    border-radius: 16px; 
                    border: 2px solid #ff4e42;
                    display: flex;
                    flex-direction: column;
                }
                h1 { color: #ff4e42; margin-bottom: 20px; text-align: center; }
                .status { 
                    background: rgba(0,0,0,0.3); 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0;
                }
                .endpoint { 
                    background: rgba(255,255,255,0.05); 
                    padding: 10px; 
                    margin: 10px 0; 
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 0.9rem;
                }
                a { color: #ff4e42; text-decoration: none; }
                a:hover { text-decoration: underline; }
                
                /* Chat Styles */
                .chat-header {
                    background: rgba(255,78,66,0.2);
                    padding: 20px;
                    border-radius: 14px 14px 0 0;
                    border-bottom: 2px solid rgba(255,78,66,0.3);
                    text-align: center;
                }
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .chat-input-area {
                    padding: 20px;
                    border-top: 2px solid rgba(255,78,66,0.3);
                    background: rgba(255,78,66,0.05);
                }
                .message {
                    padding: 12px 16px;
                    border-radius: 12px;
                    max-width: 80%;
                    line-height: 1.5;
                    word-wrap: break-word;
                }
                .message.user {
                    background: linear-gradient(135deg, #ff4e42, #ff6b5a);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                .message.assistant {
                    background: rgba(255,78,66,0.1);
                    color: #f3ede9;
                    border: 1px solid rgba(255,78,66,0.2);
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                .input-container {
                    display: flex;
                    gap: 15px;
                    align-items: flex-end;
                }
                .chat-input {
                    flex: 1;
                    background: rgba(0,0,0,0.4);
                    border: 2px solid rgba(255,78,66,0.3);
                    color: #fff;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 44px;
                    max-height: 120px;
                }
                .chat-input:focus {
                    outline: none;
                    border-color: #ff4e42;
                    box-shadow: 0 0 0 3px rgba(255,78,66,0.1);
                }
                .send-btn {
                    background: linear-gradient(135deg, #ff4e42, #ff6b5a);
                    border: none;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    min-width: 80px;
                    height: 44px;
                }
                .send-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255,78,66,0.4);
                }
                .send-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                @media (max-width: 768px) {
                    .container {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Info Panel -->
                <div class="info-panel">
                    <h1>🤖 Zentraw Agent</h1>
                    <p style="text-align: center;">Sistema de IA integrado da plataforma Zentraw</p>
                    
                    <div class="status">
                        <h3>📊 Status</h3>
                        <p>✅ Servidor ativo na porta ${PORT}</p>
                        <p>${process.env.OPENAI_API_KEY ? '✅' : '❌'} OpenAI: ${process.env.OPENAI_API_KEY ? 'Configurada' : 'Não configurada'}</p>
                        <p>🔧 Modelo: ${process.env.AGENT_MODEL || 'gpt-4-turbo-preview'}</p>
                    </div>
                    
                    <div class="status">
                        <h3>🔗 Endpoints</h3>
                        <div class="endpoint">GET <a href="/zentraw-agent.js">/zentraw-agent.js</a> - Script Modal</div>
                        <div class="endpoint">POST /api/agent/chat - API de Chat</div>
                        <div class="endpoint">GET <a href="/api/agent/status">/api/agent/status</a> - Status do Agent</div>
                    </div>
                    
                    <div class="status">
                        <h3>📚 Integração</h3>
                        <p>Para usar o Agent em sua interface:</p>
                        <div class="endpoint">&lt;script src="http://localhost:${PORT}/zentraw-agent.js"&gt;&lt;/script&gt;</div>
                        <div class="endpoint">openZentrawAgent({context: 'Minha Interface'});</div>
                    </div>
                </div>
                
                <!-- Chat Panel -->
                <div class="chat-panel">
                    <div class="chat-header">
                        <h2>💬 Chat Direto</h2>
                        <p>Converse diretamente com o Zentraw Agent</p>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="message assistant">
                            👋 Olá! Sou o Zentraw Agent. Como posso ajudá-lo hoje?
                            <br><br>
                            💡 <strong>Dicas:</strong><br>
                            • Posso responder perguntas sobre desenvolvimento<br>
                            • Ajudar com código e debug<br>
                            • Explicar tecnologias e arquiteturas
                        </div>
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="input-container">
                            <textarea 
                                id="chatInput"
                                class="chat-input" 
                                placeholder="Digite sua mensagem... (Enter para enviar)"
                                rows="2"
                            ></textarea>
                            <button id="sendBtn" class="send-btn">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                const chatMessages = document.getElementById('chatMessages');
                const chatInput = document.getElementById('chatInput');
                const sendBtn = document.getElementById('sendBtn');
                
                function addMessage(type, content) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${type}\`;
                    messageDiv.textContent = content;
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
                
                async function sendMessage() {
                    const message = chatInput.value.trim();
                    if (!message) return;
                    
                    addMessage('user', message);
                    chatInput.value = '';
                    sendBtn.disabled = true;
                    sendBtn.textContent = 'Enviando...';
                    
                    try {
                        const response = await fetch('/api/agent/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                message: message,
                                context: 'Zentraw Agent Interface'
                            })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            addMessage('assistant', data.message);
                        } else {
                            addMessage('assistant', \`❌ Erro: \${data.error}\`);
                        }
                    } catch (error) {
                        addMessage('assistant', \`❌ Erro de conexão: \${error.message}\`);
                    } finally {
                        sendBtn.disabled = false;
                        sendBtn.textContent = 'Enviar';
                        chatInput.focus();
                    }
                }
                
                sendBtn.onclick = sendMessage;
                chatInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
                
                chatInput.focus();
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

        // Verificar se a chave OpenAI está configurada
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                error: 'Chave OpenAI não configurada'
            });
        }

        // Sistema prompt especializado para Zentraw
        const systemPrompt = `Você é o Zentraw Agent, um assistente de IA especializado na plataforma Zentraw.

CONHECIMENTO BASE ZENTRAW:
- Zentraw é uma plataforma de visualização 3D e áudio
- Módulos principais: 3D Visualizer, Audio Intelligence, Template Builder
- Tecnologias: Three.js, GSAP, WebGL, Web Audio API, Blender Integration
- Suporte a formatos: MP3, WAV, MP4, GLB, FBX
- Funcionalidades: Análise de áudio, geração de visuais 3D, renderização em tempo real

DIRETRIZES DE RESPOSTA:
- Seja conciso mas informativo
- Use emojis relevantes para interface
- Foque em soluções práticas
- Sempre considere o contexto da plataforma Zentraw
- Para problemas técnicos, sugira passos específicos
- Mantenha tom profissional mas amigável

CONTEXTO ATUAL: ${context || 'Interface geral da Zentraw'}

Responda sempre em português brasileiro.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Resposta inválida da OpenAI');
        }

        res.json({
            success: true,
            message: data.choices[0].message.content,
            model: model,
            usage: data.usage || {}
        });

    } catch (error) {
        console.error('Erro no Zentraw Agent:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Zentraw Agent',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Agent status
app.get('/api/agent/status', (req, res) => {
    res.json({
        agent: {
            name: 'Zentraw Agent',
            version: '1.0.0',
            status: 'active',
            model: process.env.AGENT_MODEL || 'gpt-4-turbo-preview',
            openai_configured: !!process.env.OPENAI_API_KEY
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Zentraw Agent rodando na porta ${PORT}`);
    console.log(`🔗 Acesso: http://localhost:${PORT}`);
    console.log(`🔑 OpenAI configurada: ${process.env.OPENAI_API_KEY ? '✅ Sim' : '❌ Não'}`);
});

module.exports = app;
