# Zentraw 3D Visualizer V1.4.0

## Visão Geral
O 3D Visualizer é um sistema integrado ao Zentraw que permite gerar previews e renders 3D utilizando Blender. O sistema foi desenvolvido com interface estilo Specterr e integração completa com o backend.

## Status Atual
- **Versão**: V1.4.0.a.1
- **Data**: 16 de Julho de 2025
- **Branch**: Painel_Blender_02
- **Status**: 99% funcional - Blender execução OK, problema final de proxy de imagens

## Arquitetura

### Frontend
- **Localização**: `TemplateLibraryBuilder/client/src/pages/blender-visualizer.tsx`
- **Interface**: Layout Specterr com sidebars esquerda (20px) e direita (320px)
- **Porta**: 5176 (dinâmica via Vite)
- **Tecnologias**: React + TypeScript + Tailwind CSS

### Backend
- **Localização**: `TemplateLibraryBuilder/server/`
- **Porta**: 5001 (modificada para evitar conflitos)
- **API**: `/api/blender/preview`, `/api/blender/render`, `/api/blender/download`
- **Tecnologias**: Node.js + Express + TSX

### Integração Blender
- **Executável**: Blender instalado no sistema
- **Template**: `TemplateLibraryBuilder/Blender/template.blend` (760KB)
- **Motor**: BLENDER_EEVEE_NEXT (corrigido para compatibilidade)
- **Scripts**: Python inline gerados dinamicamente

## Funcionalidades Implementadas

### ✅ Funcionais
- Interface Specterr completa
- Controles de câmera (X, Y, Z, rotações)
- Configurações de render (resolução, qualidade, estilo)
- Conectividade backend/frontend
- Geração de scripts Python dinâmicos
- Execução do Blender via CLI
- Upload de arquivos (áudio + imagem)
- Logs detalhados para debugging

### ❌ Problemas Conhecidos
- **Proxy de Imagens**: Frontend não consegue carregar imagens geradas via proxy
- **Porta Dinâmica**: Vite muda portas automaticamente causando conflitos de CORS
- **Cache TSX**: Mudanças no backend não são detectadas automaticamente

## Configuração Atual

### Portas
- **Frontend**: 5176 (Vite automático)
- **Backend**: 5001 (fixo)
- **Proxy**: `/api` → `localhost:5001`

### CORS
```typescript
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
```

### Caminhos Importantes
```
Template: TemplateLibraryBuilder/Blender/template.blend
Uploads: TemplateLibraryBuilder/uploads/blender/
Scripts: Gerados dinamicamente inline
```

## Como Usar

### Inicialização
```bash
# Terminal 1 - Backend
cd TemplateLibraryBuilder
npm run dev:back

# Terminal 2 - Frontend  
cd TemplateLibraryBuilder
npm run dev:front
```

### Acesso
- **URL**: http://localhost:[porta_dinamica]/
- **3D Visualizer**: Disponível via menu lateral

### Workflow
1. Upload de arquivo de áudio
2. Upload de imagem de capa
3. Ajuste de parâmetros de câmera
4. Clique em "Generate Preview"
5. Aguardar render (~2.5s)
6. Visualizar resultado (quando proxy funcionar)

## Estrutura de Arquivos

```
TemplateLibraryBuilder/
├── client/src/pages/
│   ├── blender-visualizer.tsx           # Interface principal
│   ├── blender-visualizer-specterr.tsx  # Versão Specterr
│   └── blender-visualizer-old.tsx       # Versão anterior
├── server/
│   ├── backend-only.ts                  # Servidor principal
│   ├── services/blender-service.ts      # Lógica Blender
│   └── blender-paths.ts                 # Configuração de caminhos
├── Blender/
│   └── template.blend                   # Template 3D
└── uploads/blender/                     # Arquivos gerados
```

## Próximos Passos

### Prioridade Alta
1. **Resolver proxy de imagens**: Implementar solução robusta para carregamento
2. **Estabilizar portas**: Configuração fixa ou detecção automática
3. **Teste completo**: Validação end-to-end

### Prioridade Média
1. Otimização de performance
2. Mais templates 3D
3. Configurações avançadas de render

### Prioridade Baixa
1. Interface de configuração do Blender
2. Suporte a animações
3. Export para diferentes formatos

## Troubleshooting

### Erro: "Backend server not available"
- Verificar se backend está rodando na porta 5001
- Checar logs do backend para erros

### Erro: "BLENDER_EEVEE not found"
- ✅ **RESOLVIDO**: Atualizado para BLENDER_EEVEE_NEXT

### Erro: "Preview image 404"
- **EM PROGRESSO**: Problema de proxy entre portas dinâmicas

### TSX não detecta mudanças
- Reiniciar processo manualmente
- Usar `taskkill /F /IM node.exe` se necessário

## Links Relacionados
- [Log Detalhado de Desenvolvimento](./DEVELOPMENT_LOG.md)
- [Troubleshooting Avançado](./TROUBLESHOOTING.md)
- [Especificações Técnicas](./TECHNICAL_SPECS.md)
