# ZENTRAW-AGENT-DECISIONS-LOG - 3d_visualizer V1.4.0.a.8

## 27/07/2025
- Decisão: Priorizar investigação do pipeline de renderização do Blender e integração frontend/backend.
- Motivo: Arquivo MP4 é gerado, mas não reconhecido pela interface.
- Ações tomadas: Caminho absoluto, criação de diretório, logs pós-render, compliance total com protocolo.
- Próximos passos: Validar integridade do arquivo, auditar logs do Blender, revisar integração do botão de download.
- Observação: Nenhum comando ou task do TemplateLibraryBuilder utilizado.

## [2025-07-29] Correção backend para automação e compliance de portas

- Problema: Backend ignorava variável de ambiente ZENTRAW_PORT, forçando porta 3004 e impedindo automação de testes.
- Ação: Corrigido backend para aceitar ZENTRAW_PORT conforme documentação, README e protocolo.
- Resultado: Backend inicia corretamente nas portas 3005 e 3006, validando automação e compliance. Porta 3004 segue ocupada por processo fantasma.
- Lições aprendidas: Garantir que código siga documentação e permita automação total.
- Próximos passos: Auditoria de processos na porta 3004, validação completa dos endpoints e interface.

## 2025-07-30
- Decisão: Implementar rotina automática de cancelamento de renders e liberação da porta 3004
- Contexto: Problema recorrente de node.exe persistente e porta ocupada
- Resultado: Teste validado, funcionalidade preservada, compliance total
- Lições aprendidas: Automação proativa elimina necessidade de scripts externos
