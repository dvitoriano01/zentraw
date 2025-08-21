/**
 * ZENTRAW AGENT - Modal UI Component
 * Componente modular que pode ser integrado em qualquer interface da Zentraw
 */

class ZentrawAgent {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || 'http://localhost:3007/api/agent/chat',
            modal: {
                id: config.modalId || 'zentrawAgentModal',
                width: config.width || '900px',
                height: config.height || '700px',
                zIndex: config.zIndex || 10000
            },
            context: config.context || 'Interface Zentraw',
            model: config.model || 'gpt-4-turbo-preview'
        };
        
        this.isOpen = false;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
        console.log('🤖 Zentraw Agent inicializado');
    }

    createModal() {
        // Remover modal existente se houver
        const existing = document.getElementById(this.config.modal.id);
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = this.config.modal.id;
        modal.innerHTML = this.getModalHTML();
        document.body.appendChild(modal);
    }

    getModalHTML() {
        return `
            <div class="zentraw-agent-overlay" style="display: none;">
                <div class="zentraw-agent-modal">
                    <div class="zentraw-agent-header">
                        <div class="zentraw-agent-title">
                            🤖 Zentraw Agent
                            <span class="zentraw-agent-subtitle">| AI Assistant</span>
                        </div>
                        <div class="zentraw-agent-controls">
                            <select class="zentraw-agent-model-select">
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4-turbo-preview" selected>GPT-4 Turbo</option>
                            </select>
                            <button class="zentraw-agent-close">✕</button>
                        </div>
                    </div>
                    
                    <div class="zentraw-agent-messages" id="zentrawAgentMessages">
                        <div class="zentraw-agent-message zentraw-agent-assistant">
                            👋 Olá! Sou o Zentraw Agent, seu assistente especializado da plataforma Zentraw. 
                            Como posso ajudar você hoje?
                        </div>
                    </div>
                    
                    <div class="zentraw-agent-input-area">
                        <div class="zentraw-agent-context">
                            <span>Contexto:</span>
                            <span class="zentraw-agent-context-value">${this.config.context}</span>
                        </div>
                        <div class="zentraw-agent-input-container">
                            <textarea 
                                class="zentraw-agent-input" 
                                placeholder="Digite sua pergunta sobre a Zentraw... (Enter para enviar, Shift+Enter para nova linha)"
                                rows="2"
                            ></textarea>
                            <button class="zentraw-agent-send">
                                <span class="zentraw-agent-send-text">Enviar</span>
                                <span class="zentraw-agent-send-loading" style="display: none;">
                                    <span class="zentraw-agent-spinner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            ${this.getModalCSS()}
        `;
    }

    getModalCSS() {
        return `
            <style>
                .zentraw-agent-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    z-index: ${this.config.modal.zIndex};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: zentrawAgentFadeIn 0.3s ease;
                }

                .zentraw-agent-modal {
                    width: ${this.config.modal.width};
                    height: ${this.config.modal.height};
                    max-width: 95vw;
                    max-height: 95vh;
                    background: linear-gradient(135deg, #12100f 0%, #1a1815 100%);
                    border: 2px solid #ff4e42;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
                    color: #f3ede9;
                    box-shadow: 0 20px 40px rgba(255, 78, 66, 0.3);
                    animation: zentrawAgentSlideIn 0.4s ease;
                }

                .zentraw-agent-header {
                    padding: 20px;
                    background: rgba(255, 78, 66, 0.1);
                    border-bottom: 1px solid rgba(255, 78, 66, 0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 10px 10px 0 0;
                }

                .zentraw-agent-title {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: #ff4e42;
                    text-transform: uppercase;
                }

                .zentraw-agent-subtitle {
                    font-size: 0.9rem;
                    color: #c2b8b2;
                    font-weight: normal;
                }

                .zentraw-agent-controls {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .zentraw-agent-model-select {
                    background: rgba(255, 78, 66, 0.1);
                    border: 1px solid rgba(255, 78, 66, 0.3);
                    color: #f3ede9;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    cursor: pointer;
                }

                .zentraw-agent-close {
                    background: rgba(255, 78, 66, 0.2);
                    border: 1px solid #ff4e42;
                    color: #ff4e42;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }

                .zentraw-agent-close:hover {
                    background: #ff4e42;
                    color: #12100f;
                }

                .zentraw-agent-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .zentraw-agent-message {
                    padding: 15px;
                    border-radius: 10px;
                    line-height: 1.5;
                    max-width: 85%;
                    animation: zentrawAgentMessageSlide 0.3s ease;
                }

                .zentraw-agent-user {
                    background: rgba(255, 78, 66, 0.15);
                    border: 1px solid rgba(255, 78, 66, 0.3);
                    align-self: flex-end;
                    color: #f3ede9;
                }

                .zentraw-agent-assistant {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    align-self: flex-start;
                    color: #f3ede9;
                }

                .zentraw-agent-input-area {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 78, 66, 0.3);
                    background: rgba(255, 78, 66, 0.05);
                }

                .zentraw-agent-context {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    font-size: 0.9rem;
                    color: #c2b8b2;
                }

                .zentraw-agent-context-value {
                    color: #ff4e42;
                    font-weight: bold;
                }

                .zentraw-agent-input-container {
                    display: flex;
                    gap: 15px;
                    align-items: flex-end;
                }

                .zentraw-agent-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 78, 66, 0.3);
                    color: #f3ede9;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 1rem;
                    resize: none;
                    min-height: 60px;
                    max-height: 120px;
                }

                .zentraw-agent-input:focus {
                    outline: none;
                    border-color: #ff4e42;
                    box-shadow: 0 0 0 3px rgba(255, 78, 66, 0.2);
                }

                .zentraw-agent-input::placeholder {
                    color: #c2b8b2;
                }

                .zentraw-agent-send {
                    background: linear-gradient(135deg, #ff4e42, #c2362f);
                    border: none;
                    color: #12100f;
                    padding: 15px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    min-width: 100px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .zentraw-agent-send:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 78, 66, 0.4);
                }

                .zentraw-agent-send:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .zentraw-agent-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(18, 16, 15, 0.3);
                    border-radius: 50%;
                    border-top-color: #12100f;
                    animation: zentrawAgentSpin 1s linear infinite;
                }

                @keyframes zentrawAgentFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes zentrawAgentSlideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes zentrawAgentMessageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes zentrawAgentSpin {
                    to { transform: rotate(360deg); }
                }

                /* Scrollbar customizada */
                .zentraw-agent-messages::-webkit-scrollbar {
                    width: 8px;
                }

                .zentraw-agent-messages::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }

                .zentraw-agent-messages::-webkit-scrollbar-thumb {
                    background: rgba(255, 78, 66, 0.3);
                    border-radius: 4px;
                }

                .zentraw-agent-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 78, 66, 0.5);
                }

                /* Responsivo */
                @media (max-width: 768px) {
                    .zentraw-agent-modal {
                        width: 95vw;
                        height: 90vh;
                        margin: 20px;
                    }
                    
                    .zentraw-agent-title {
                        font-size: 1.2rem;
                    }
                    
                    .zentraw-agent-input-container {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .zentraw-agent-send {
                        width: 100%;
                    }
                }
            </style>
        `;
    }

    attachEventListeners() {
        const modal = document.getElementById(this.config.modal.id);
        
        // Fechar modal
        modal.querySelector('.zentraw-agent-close').onclick = () => this.close();
        modal.querySelector('.zentraw-agent-overlay').onclick = (e) => {
            if (e.target.classList.contains('zentraw-agent-overlay')) {
                this.close();
            }
        };

        // Input e envio
        const input = modal.querySelector('.zentraw-agent-input');
        const sendBtn = modal.querySelector('.zentraw-agent-send');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.onclick = () => this.sendMessage();

        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        const modal = document.getElementById(this.config.modal.id);
        modal.querySelector('.zentraw-agent-overlay').style.display = 'flex';
        modal.querySelector('.zentraw-agent-input').focus();
        this.isOpen = true;
        console.log('🤖 Zentraw Agent aberto');
    }

    close() {
        const modal = document.getElementById(this.config.modal.id);
        modal.querySelector('.zentraw-agent-overlay').style.display = 'none';
        this.isOpen = false;
        console.log('🤖 Zentraw Agent fechado');
    }

    async sendMessage() {
        const modal = document.getElementById(this.config.modal.id);
        const input = modal.querySelector('.zentraw-agent-input');
        const sendBtn = modal.querySelector('.zentraw-agent-send');
        const sendText = sendBtn.querySelector('.zentraw-agent-send-text');
        const sendLoading = sendBtn.querySelector('.zentraw-agent-send-loading');
        const modelSelect = modal.querySelector('.zentraw-agent-model-select');

        const message = input.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage('user', message);
        
        // Limpar input e desabilitar botão
        input.value = '';
        sendBtn.disabled = true;
        sendText.style.display = 'none';
        sendLoading.style.display = 'flex';

        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    model: modelSelect.value,
                    context: this.config.context
                })
            });

            const data = await response.json();

            if (data.success) {
                this.addMessage('assistant', data.message);
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.message }
                );
            } else {
                this.addMessage('assistant', `❌ Erro: ${data.error}`);
            }

        } catch (error) {
            console.error('Erro ao comunicar com o Zentraw Agent:', error);
            this.addMessage('assistant', 
                `❌ Erro de conexão: ${error.message}\\n\\nVerifique se o Zentraw Agent está rodando na porta 3007.`
            );
        } finally {
            // Reabilitar botão
            sendBtn.disabled = false;
            sendText.style.display = 'block';
            sendLoading.style.display = 'none';
            input.focus();
        }
    }

    addMessage(type, content) {
        const modal = document.getElementById(this.config.modal.id);
        const messagesContainer = modal.querySelector('.zentraw-agent-messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `zentraw-agent-message zentraw-agent-${type}`;
        messageDiv.textContent = content;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Método para atualizar contexto dinamicamente
    updateContext(newContext) {
        this.config.context = newContext;
        const modal = document.getElementById(this.config.modal.id);
        const contextValue = modal.querySelector('.zentraw-agent-context-value');
        if (contextValue) {
            contextValue.textContent = newContext;
        }
    }
}

// Função global para criar e abrir o Zentraw Agent
function openZentrawAgent(config = {}) {
    if (!window.zentrawAgent) {
        window.zentrawAgent = new ZentrawAgent(config);
    }
    window.zentrawAgent.open();
}

// Export para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZentrawAgent;
}
