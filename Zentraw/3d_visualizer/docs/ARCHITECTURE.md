# ARCHITECTURE.md

## Finalização Automática
Ao receber SIGINT ou ser finalizado via taskkill, o backend executa:
- Cancelamento de todos renders ativos
- Finalização do processo node.exe (Windows)
- Liberação garantida da porta 3004