const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3007;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3003', 'http://127.0.0.1:3003'],
    credentials: true
}));

// Logs
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Zentraw Agent Test',
        version: '1.0.0-test'
    });
});

// Servir zentraw-agent.js
app.get('/zentraw-agent.js', (req, res) => {
    try {
        console.log('🔍 Servindo zentraw-agent.js...');
        const filePath = path.join(__dirname, 'public', 'zentraw-agent.js');
        
        if (!fs.existsSync(filePath)) {
            console.log('❌ Arquivo não encontrado');
            return res.status(404).send('File not found');
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        console.log('✅ Arquivo carregado, tamanho:', content.length);
        
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');
        
        res.send(content);
        console.log('📤 zentraw-agent.js servido');
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
        res.status(500).send('Error: ' + error.message);
    }
});

// Chat com redirecionamento (SEM OpenAI - apenas teste)
app.post('/api/chat', (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mensagem é obrigatória' 
            });
        }

        console.log('💬 Mensagem recebida:', message);
        
        // DETECÇÃO DE SOLICITAÇÃO DE IMAGEM
        const imageKeywords = [
            'criar imagem', 'gerar imagem', 'fazer imagem', 'desenhar',
            'create image', 'generate image', 'make image', 'draw',
            'ilustrar', 'pintar', 'arte', 'desenho'
        ];
        
        const isImageRequest = imageKeywords.some(keyword => 
            message.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (isImageRequest) {
            console.log('🎨 REDIRECIONAMENTO DETECTADO!');
            return res.json({
                success: true,
                response: `🎨 **REDIRECIONAMENTO AUTOMÁTICO FUNCIONANDO!**\n\nDetectei que você quer: "${message}"\n\n✅ **Sistema funcionando:** O redirecionamento para DALL-E 3 foi detectado corretamente!\n\n💡 **Em produção:** Isso seria automaticamente enviado para o DALL-E 3 e retornaria uma imagem real.`,
                redirected: true,
                model: 'dall-e-3-auto',
                detected_keywords: imageKeywords.filter(k => message.toLowerCase().includes(k.toLowerCase())),
                original_prompt: message
            });
        }
        
        // Chat normal
        return res.json({
            success: true,
            response: `✅ **Zentraw Agent funcionando!**\n\nMensagem: "${message}"\n\n🔧 **Status:** Redirecionamento automático ativo\n🎨 **Palavras-chave monitoradas:** ${imageKeywords.length} termos\n⚡ **Sistema:** Operacional`,
            redirected: false,
            model: 'gpt-4o-simulation'
        });
        
    } catch (error) {
        console.error('❌ Erro no chat:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🧪 Zentraw Agent TEST rodando na porta', PORT);
    console.log('🔗 Acesso: http://localhost:' + PORT);
    console.log('🎯 Objetivo: Testar redirecionamento automático');
    console.log('===============================================');
});
