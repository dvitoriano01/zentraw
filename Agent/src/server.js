const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
