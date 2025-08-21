const express = require('express');
const cors = require('cors');
const path = require('path');
const grokInterface = require('./grok-interface');

const app = express();
const PORT = process.env.PORT || 3007;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota principal do Agent - Nova Interface Grok
app.get('/', (req, res) => {
    res.send(grokInterface);
});

// Servir arquivo JavaScript do Agent
app.get('/zentraw-agent.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'zentraw-agent.js'));
});

// OpenAI Functions endpoint - Lista funções disponíveis
app.get('/api/agent/functions', (req, res) => {
    const availableFunctions = [
        {
            name: "code_interpreter",
            description: "Executa código Python para análise de dados, cálculos e visualizações"
        },
        {
            name: "web_search",
            description: "Busca informações atualizadas na web"
        },
        {
            name: "file_search",
            description: "Busca e analisa conteúdo em arquivos carregados"
        },
        {
            name: "image_generation",
            description: "Gera imagens usando DALL-E"
        },
        {
            name: "vision",
            description: "Analisa e descreve imagens enviadas"
        },
        {
            name: "function_calling",
            description: "Chama funções customizadas definidas pelo usuário"
        },
        {
            name: "json_mode",
            description: "Retorna respostas estruturadas em formato JSON"
        },
        {
            name: "assistants_api",
            description: "Utiliza Assistants API para conversações persistentes"
        },
        {
            name: "embeddings",
            description: "Gera embeddings de texto para busca semântica"
        },
        {
            name: "moderation",
            description: "Analisa conteúdo para identificar violações de política"
        },
        {
            name: "whisper",
            description: "Transcreve áudio em texto"
        },
        {
            name: "text_to_speech",
            description: "Converte texto em áudio"
        }
    ];

    res.json({
        success: true,
        functions: availableFunctions,
        count: availableFunctions.length
    });
});

// Zentraw Agent Chat Endpoint
app.post('/api/agent/chat', async (req, res) => {
    try {
        const { message, model = 'gpt-4-turbo-preview', context = null, functions = [] } = req.body;

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

        // Import OpenAI
        const { OpenAI } = require('openai');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Construir prompt com contexto
        let systemPrompt = `Você é o Zentraw Agent, um assistente de IA integrado à plataforma Zentraw.

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

CONTEXTO DA SESSÃO: ${context || 'Chat direto no Zentraw Agent'}`;

        // Preparar mensagens
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];

        // Configurar parâmetros da API
        const apiParams = {
            model: model,
            messages: messages,
            max_tokens: 2000,
            temperature: 0.7
        };

        // Adicionar functions se especificadas
        if (functions && functions.length > 0) {
            apiParams.functions = functions;
        }

        // Fazer chamada para OpenAI
        const completion = await openai.chat.completions.create(apiParams);

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
    console.log(`🤖 Zentraw Agent rodando na porta ${PORT}`);
    console.log(`🔗 Acesso: http://localhost:${PORT}`);
    console.log(`🔑 OpenAI configurada: ${process.env.OPENAI_API_KEY ? '✅ Sim' : '❌ Não'}`);
});

module.exports = app;
