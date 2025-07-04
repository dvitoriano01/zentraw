# Regras Básicas de Documentação para Agentes/Equipes

Para garantir clareza, rastreabilidade e colaboração eficiente, cada agente ou equipe deve seguir as seguintes diretrizes ao documentar seu progresso e entregas:

## 0. Leitura Obrigatória das Documentações Básicas Zentraw
- Todo agente deve ler e consultar periodicamente as documentações fundamentais do projeto Zentraw, localizadas na raiz da pasta `docs`.
- Documentações obrigatórias:
  - [INDEX.md](./INDEX.md): Índice geral e navegação da documentação.
  - [DOCUMENTATION_RULES_AGENT.md](./DOCUMENTATION_RULES_AGENT.md): Regras de documentação para agentes/equipes.
  - [README.md](../README.md): Visão geral do projeto Zentraw.
- Outras documentações relevantes podem ser adicionadas à raiz de `docs` e devem ser consultadas conforme orientação da equipe.

## 1. Versionamento
- Sempre registre a versão atual do módulo, componente ou entrega.
- Utilize um cabeçalho claro, ex: `Versão: 1.0.0 - Data: 2025-07-04`.
- Mantenha um histórico de versões e mudanças relevantes.

## 1.1. Histórico de Rollback
- Sempre registre rollbacks realizados, incluindo:
  - Data do rollback
  - Motivo do rollback
  - Versão retomada
- Exemplo de entrada:
  - `Rollback em 2025-07-04: Motivo - bug crítico. Retomada da versão 1.0.0.`

## 2. Índice
- Inclua um índice no início do arquivo, listando as principais seções e links internos.
- Exemplo:
  - [Visão Geral](#visão-geral)
  - [Funcionalidades](#funcionalidades)
  - [Histórico de Versões](#histórico-de-versões)
  - [Histórico de Rollback](#histórico-de-rollback)

## 3. Sucessos e Marcos
- Registre entregas concluídas, marcos importantes e funcionalidades implementadas.
- Destaque conquistas relevantes para o projeto.

## 4. Informações Vitais
- Documente decisões técnicas, dependências, requisitos e pontos críticos.
- Inclua instruções de uso, build, testes e contato do responsável.

## 5. Atualização Contínua
- Mantenha a documentação sempre atualizada conforme o andamento do projeto.
- Indique claramente a data da última atualização.

## 6. Commits e GIT Funcional
- Realize ao menos um commit diário, mesmo que não haja grandes mudanças.
- Garanta que o repositório GIT esteja sempre funcional para permitir rollback a qualquer versão anterior.
- Antes de grandes alterações, crie um commit e registre o ponto de restauração na documentação.

---

> Siga este modelo para cada documentação de agente, equipe ou módulo. Adapte conforme necessário para a realidade do seu time.
