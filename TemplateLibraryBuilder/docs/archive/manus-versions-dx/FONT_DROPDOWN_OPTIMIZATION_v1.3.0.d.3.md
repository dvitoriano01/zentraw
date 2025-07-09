# Font Dropdown Optimization Plan - v1.3.0.d.3

## Objetivo
Eliminar o dropdown de seleção de família de fontes e reduzir as variações da fonte Akuina para melhorar a UX e performance.

## Problemas Identificados

### 1. Dropdown de Família Redundante
- **Localização**: `TextPropertiesPanel.tsx` linhas 279-315
- **Problema**: Dois dropdowns causam confusão - um para família e outro para variações
- **Solução**: Manter apenas um dropdown principal com todas as fontes organizadas

### 2. Excesso de Variações Akuina 
- **Problema**: 12 variações da fonte Akuina (6 pesos × 2 estilos)
- **Localização**: `freepikFontsFixed.ts` linhas 17-39
- **Variações atuais**:
  - Light (200), Regular (400), Medium (500), Semibold (600), Bold (700), Extra Bold (800)
  - Cada peso tem versão normal e itálica (12 total)

## Seleção das Melhores Variações Akuina

### Critérios de Seleção
1. **Uso mais comum**: Regular (400) e Bold (700) são essenciais
2. **Contraste visual**: Light (200) para títulos delicados 
3. **Flexibilidade**: Medium (500) para meio-termo entre regular e bold
4. **Estilo**: Manter itálica apenas para Regular e Bold

### 4 Variações Selecionadas
1. **Akuina Light** - weight: 200, style: normal (títulos delicados)
2. **Akuina Regular** - weight: 400, style: normal (texto padrão)
3. **Akuina Regular Italic** - weight: 400, style: italic (ênfase)
4. **Akuina Bold** - weight: 700, style: normal (destaques/títulos)

### Variações Removidas (8)
- Akuina Medium (500) - redundante com Regular e Bold
- Akuina Semibold (600) - muito próximo do Bold
- Akuina Extra Bold (800) - excessivo
- Akuina Black (800) - duplicado do Extra Bold
- Todas as itálicas exceto Regular Italic - raramente usadas

## Implementação

### Fase 1: Otimização de Fontes
1. Atualizar `freepikFontsFixed.ts` - reduzir Akuina para 4 variações
2. Validar que as 4 variações carregam corretamente

### Fase 2: Simplificação do Dropdown
1. Remover dropdown de família (`Family`) do `TextPropertiesPanel.tsx`
2. Manter apenas o dropdown principal (`Font`) com todas as fontes
3. Simplificar lógica de seleção - remover `selectedFontFamily` e `familyVariants`
4. Atualizar handlers para trabalhar apenas com o dropdown principal

### Fase 3: Validação
1. Testar carregamento das 4 variações Akuina selecionadas
2. Validar que outras fontes ainda funcionam corretamente
3. Verificar que a UI fica mais limpa e intuitiva

## Benefícios Esperados
- **UX**: Interface mais simples e intuitiva (um dropdown vs dois)
- **Performance**: Menos fontes para carregar (-8 variações Akuina)
- **Manutenção**: Código mais simples, menos lógica de sincronização
- **Usabilidade**: Seleção mais rápida e direta

## Rollback
- Checkpoint criado em v1.3.0.d.3
- Todos os arquivos originais preservados no Git
- Rollback seguro disponível a qualquer momento
