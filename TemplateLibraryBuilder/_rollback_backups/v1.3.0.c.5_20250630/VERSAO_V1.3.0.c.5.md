# Zentraw Photo Editor - Versionamento V1.3.0.c.5

## Alterações principais
- Correção crítica: painel de texto não quebra mais ao clicar em "TEXT" (uso de variável inexistente removido).
- Refatoração do sistema de fontes:
  - Dropdown "Font" exibe apenas famílias únicas, com preview visual.
  - Dropdown "Family" exibe variações (peso/estilo) da família selecionada.
  - Labels padronizados para "Font" e "Family" (em inglês).
  - Sincronização de estado ao trocar variação/família.
- Proteção contra estados nulos/indefinidos ao criar texto ou trocar fonte.
- Rollback e restauração de arquivos críticos para garantir estabilidade.
- Observações:
  - Dropdown "Family" ainda não seleciona corretamente a variação.
  - Box de texto corta fontes grandes (overflow/altura).
  - Todas as observações e pendências salvas para continuidade.

## Próximos passos sugeridos
- Corrigir seleção do dropdown "Family" (aplicar variação corretamente).
- Ajustar box de texto para suportar fontes grandes sem corte.
- Refino visual/UX adicional e integração de system fonts.
- Documentação final e testes de estabilidade.

---

Todas as alterações e observações desta versão estão salvas para commit e continuidade do desenvolvimento.
