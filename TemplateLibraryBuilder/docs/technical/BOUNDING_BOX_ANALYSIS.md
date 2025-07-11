# 🔍 ZENTRAW PHOTO EDITOR - ANÁLISE DE BOUNDING BOX EM ALTA RESOLUÇÃO

📅 **Data:** 10/07/2025  
🎯 **Módulo:** TemplateLibraryBuilder - Photo Editor  
🔧 **Problema:** Bounding boxes desproporcionais em alta resolução

## 🚨 **PROBLEMA IDENTIFICADO**

### 📋 **Descrição:**
Os bounding boxes dos elementos (textos e shapes) aparecem menores em alta resolução devido ao uso de tamanhos fixos em pixels enquanto o canvas utiliza devicePixelRatio elevado.

### 🎯 **Elementos Afetados:**
- **Textos:** fontSize fixo (48px)
- **Shapes:** Dimensões fixas (width/height: 100px, radius: 50px)
- **Controles:** cornerSize e borders não escalados

## 🔬 **ANÁLISE TÉCNICA**

### **Canvas Alta Resolução:**
```typescript
Canvas visual: 1200x1200px (mostrado na tela)
Canvas físico: 2400x2400px (devicePixelRatio = 2)
enableRetinaScaling: true
devicePixelRatio: 2.0+
```

### **Problema de Proporção:**
```
Elemento fixo: 48px
Canvas normal (1200px): 48/1200 = 4.0% ✅
Canvas alta res (2400px): 48/2400 = 2.0% ❌ (50% menor)
```

## 🛠️ **SOLUÇÃO IMPLEMENTADA**

### **V1.3.0.c.10 - Correção de Textos:**
- ✅ Função `calculateScaledFontSize()`
- ✅ fontSize escalado baseado em devicePixelRatio
- ✅ Proporção corrigida: 96px/2400px = 4.0%

### **Próximo: Correção de Shapes:**
- 🔄 Rectangle, Circle, Triangle com scaling
- 🔄 Controles visuais normalizados
- 🔄 Sistema unificado para todos os elementos

## 📊 **COMPARAÇÃO VISUAL**

### **Antes (Problema):**
```
Canvas 2400x2400px (alta resolução)
├── Texto: 48px → 2% proporção ❌
├── Rectangle: 100px → 4.1% proporção ❌  
└── Circle: 50px radius → 2% proporção ❌
```

### **Depois (Corrigido):**
```
Canvas 2400x2400px (alta resolução)
├── Texto: 96px → 4% proporção ✅
├── Rectangle: 200px → 8.3% proporção ✅
└── Circle: 100px radius → 4% proporção ✅
```

## 🎯 **IMPLEMENTAÇÃO COMPLETA PENDENTE**

### **Escopo Total:**
1. ✅ **Textos** - Implementado em V1.3.0.c.10
2. 🔄 **Shapes** - Pendente implementação
3. 🔄 **Controles** - Pendente normalização
4. 🔄 **Sistema unificado** - Pendente consolidação

### **Estratégia Recomendada:**
- **Opção A:** Scaling universal baseado em devicePixelRatio
- **Função:** `calculateScaledSize(baseSize)` para todos os elementos
- **Aplicação:** Textos, shapes, controles, borders

---

**Status:** 🔄 **EM DESENVOLVIMENTO**  
**Módulo:** TemplateLibraryBuilder/PhotoEditor  
**Versão:** V1.3.0.c.10+
