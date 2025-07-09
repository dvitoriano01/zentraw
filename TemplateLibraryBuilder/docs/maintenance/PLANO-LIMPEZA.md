# Zentraw Photo Editor - Plano de Limpeza V1.3.0.c.7

## 🧹 Arquivos para Arquivamento

### 📎 Attached Assets (Candidatos para Arquivamento)

```
TemplateLibraryBuilder/attached_assets/
├── image_*.png                                    # Imagens temporárias
├── Pasted-*.txt                                   # Textos colados temporários
└── ... (demais arquivos temporários)
```

**Ação:** Mover para `archive/attached_assets/`

### 🧪 Arquivos de Teste

```
TemplateLibraryBuilder/
├── testeGit.txt.txt                               # Arquivo de teste Git
└── client/src/
    └── [componentes não utilizados]
```

**Ação:** Verificar uso e mover para `archive/test_files/`

### 🗂️ Estrutura de Arquivamento Proposta

```
TemplateLibraryBuilder/
├── archive/                                       # Nova pasta de arquivos
│   ├── attached_assets/                           # Assets temporários
│   ├── test_files/                                # Arquivos de teste
│   ├── old_versions/                              # Versões antigas
│   └── documentation/                             # Documentação histórica
├── client/                                        # Código principal
├── public/                                        # Assets públicos
├── server/                                        # Backend
└── ... (arquivos essenciais)
```

## 📋 Processo de Limpeza

### Fase 1: Identificação

- [ ] Listar todos os arquivos não essenciais
- [ ] Verificar dependências e referências
- [ ] Confirmar que não são usados em produção

### Fase 2: Backup

- [ ] Criar backup completo antes da limpeza
- [ ] Tag Git da versão pré-limpeza
- [ ] Documentar todos os arquivos movidos

### Fase 3: Arquivamento

- [ ] Criar estrutura de pastas `archive/`
- [ ] Mover arquivos não essenciais
- [ ] Atualizar .gitignore se necessário
- [ ] Testar build após limpeza

### Fase 4: Verificação

- [ ] Build completo sem erros
- [ ] Funcionalidades principais funcionando
- [ ] Tamanho do repositório reduzido
- [ ] Documentação atualizada

## 🎯 Arquivos Confirmados como Essenciais

### Core do Editor

- `client/src/pages/PhotoEditorFixed.tsx` ✅
- `client/src/components/editor/TextPropertiesPanel.tsx` ✅
- `client/src/constants/freepikFontsFixed.ts` ✅
- `client/src/styles/freepik-fonts.css` ✅

### Fontes e Assets

- `public/fonts/freepik/` ✅
- `client/src/components/ui/` ✅
- `client/src/lib/` ✅

### Configuração

- `package.json` ✅
- `vite.config.ts` ✅
- `tailwind.config.ts` ✅
- `tsconfig.json` ✅

## 🚨 Arquivos Suspeitos (Verificar Antes de Arquivar)

### Pasta Server

```
TemplateLibraryBuilder/server/
```

**Verificar:** Se é usado para backend ou pode ser arquivado

### Componentes UI Não Referenciados

```
client/src/components/
├── [componentes não importados]
└── [páginas antigas]
```

**Verificar:** Uso em imports e dependências

### Assets Não Referenciados

```
public/
├── [imagens não usadas]
└── [arquivos não referenciados]
```

**Verificar:** Referências em CSS e código

## 🔍 Comandos de Verificação

### Encontrar Arquivos Não Utilizados

```bash
# Verificar imports não utilizados
grep -r "import.*from" client/src/ | grep -v node_modules

# Verificar referências a arquivos
grep -r "\.png\|\.jpg\|\.svg" client/src/ | grep -v node_modules

# Verificar tamanho das pastas
du -sh */ | sort -hr
```

### Verificar Dependências

```bash
# Verificar se um arquivo é referenciado
grep -r "nome_do_arquivo" client/src/

# Verificar imports específicos
grep -r "import.*ComponentName" client/src/
```

## 📦 Benefícios da Limpeza

### Performance

- Redução do tamanho do repositório
- Build mais rápido
- Menor uso de memória

### Manutenibilidade

- Código mais limpo e organizado
- Menos confusão para desenvolvedores
- Documentação mais clara

### Segurança

- Remoção de arquivos sensíveis temporários
- Limpeza de dados de teste
- Redução de superfície de ataque

## 🎯 Cronograma Sugerido

### Semana 1: Preparação

- Identificar arquivos não essenciais
- Criar backup completo
- Documentar dependências

### Semana 2: Execução

- Criar estrutura de arquivamento
- Mover arquivos não essenciais
- Testar funcionalidades

### Semana 3: Verificação

- Build completo
- Testes de funcionalidades
- Documentação atualizada

### Semana 4: Finalização

- Commit final da limpeza
- Tag da versão limpa
- Atualização da documentação

## 🔄 Comandos de Arquivamento

### Criar Estrutura

```bash
mkdir -p archive/attached_assets
mkdir -p archive/test_files
mkdir -p archive/old_versions
mkdir -p archive/documentation
```

### Mover Arquivos

```bash
# Mover attached_assets
mv attached_assets/* archive/attached_assets/

# Mover arquivos de teste
mv testeGit.txt.txt archive/test_files/

# Verificar antes de deletar pastas vazias
rmdir attached_assets
```

### Commit da Limpeza

```bash
git add .
git commit -m "chore: Limpeza e arquivamento de arquivos não essenciais

- Movidos attached_assets para archive/
- Arquivados arquivos de teste
- Estrutura limpa e organizada
- Build testado e funcionando"
```

---

**Versão:** V1.3.0.c.7  
**Status:** Plano Preparado ✅  
**Execução:** Após confirmação da versão estável
