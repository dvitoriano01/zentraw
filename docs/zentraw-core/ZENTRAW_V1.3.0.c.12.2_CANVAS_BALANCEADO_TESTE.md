# ZENTRAW V1.3.0.c.12.2 - CANVAS BALANCEADO (TESTE CONSERVADOR)

## 🎯 PROBLEMA IDENTIFICADO

O canvas dobrado estava empurrando a barra de propriedades para fora da tela devido a:

1. `minWidth: 'max-content'` forçando expansão excessiva
2. Área de 95% muito grande para o layout
3. Mínimo de 120% muito agressivo

## 🔧 SOLUÇÃO BALANCEADA

### Mudanças Conservadoras:

```css
// ANTES (agressivo):
availableWidth = containerRect.width * 0.95; // 95%
optimalScale = Math.max(optimalScale, 1.2);  // 120% mínimo
minWidth: 'max-content' // Expansão sem limite

// AGORA (balanceado):
availableWidth = containerRect.width * 0.85; // 85%
optimalScale = Math.max(optimalScale, 1.0);  // 100% mínimo
// minWidth removido // Sem expansão forçada
```

### Resultados Esperados:

1. **Canvas ainda maior** que a versão original
2. **Barra de propriedades preservada** e visível
3. **Layout balanceado** sem empurrar elementos
4. **Centralização mantida** e funcional

## 📊 VALORES DE TESTE

### Sequência de Teste:

1. **85% área + 100% mínimo** (atual - conservador)
2. Se barra aparecer: **88% área + 110% mínimo** (moderado)
3. Se ainda ok: **90% área + 115% mínimo** (ideal)
4. Se problema: voltar ao anterior

### Validação Visual:

- [ ] Barra de propriedades visível à direita
- [ ] Canvas centralizado e maior que antes
- [ ] Sem scroll horizontal indesejado
- [ ] Layout responsivo funcionando

---

**Status**: TESTE CONSERVADOR EM ANDAMENTO  
**Próximo**: Validação visual e ajustes graduais
