#!/bin/bash

# =============================================================================
# 🚀 ZENTRAW WSL CONTROL SCRIPT V1.0.0
# =============================================================================
# Autor: GitHub Copilot + Denys Victoriano
# Data: 19/08/2025
# Descrição: Script de controle total para Zentraw em ambiente WSL
# =============================================================================

# Configurações
ZENTRAW_DIR="$HOME/zentraw"
ADMIN_PANEL_DIR="$ZENTRAW_DIR/Admin_Panel"
TEMPLATE_BUILDER_DIR="$ZENTRAW_DIR/TemplateLibraryBuilder"
MEDIA_CONTROL_DIR="$ZENTRAW_DIR/ZentrawMediaControl"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para exibir header
show_header() {
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${CYAN}🚀 ZENTRAW WSL CONTROL CENTER V1.0.0${NC}"
    echo -e "${CYAN}============================================================${NC}"
    echo -e "${GREEN}📍 Environment: WSL Ubuntu 22.04${NC}"
    echo -e "${GREEN}📍 Node.js: $(node --version)${NC}"
    echo -e "${GREEN}📍 NPM: $(npm --version)${NC}"
    echo -e "${GREEN}📍 Current Branch: $(cd $ZENTRAW_DIR && git branch --show-current)${NC}"
    echo -e "${CYAN}============================================================${NC}"
}

# Função para verificar status dos módulos
check_status() {
    echo -e "${BLUE}🔍 Verificando status dos módulos...${NC}"
    
    # Admin Panel
    if curl -s http://localhost:3003/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Admin Panel: ONLINE (http://localhost:3003)${NC}"
    else
        echo -e "${RED}❌ Admin Panel: OFFLINE${NC}"
    fi
    
    # Template Builder Backend
    if curl -s http://localhost:3004/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Template Builder Backend: ONLINE (http://localhost:3004)${NC}"
    else
        echo -e "${RED}❌ Template Builder Backend: OFFLINE${NC}"
    fi
    
    # Template Builder Frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Template Builder Frontend: ONLINE (http://localhost:3000)${NC}"
    else
        echo -e "${RED}❌ Template Builder Frontend: OFFLINE${NC}"
    fi
    
    # Media Control
    if curl -s http://localhost:5002/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Media Control: ONLINE (http://localhost:5002)${NC}"
    else
        echo -e "${RED}❌ Media Control: OFFLINE${NC}"
    fi
}

# Função para iniciar Admin Panel
start_admin_panel() {
    echo -e "${YELLOW}🚀 Iniciando Admin Panel...${NC}"
    cd "$ADMIN_PANEL_DIR"
    npm start &
    sleep 3
    echo -e "${GREEN}✅ Admin Panel iniciado em http://localhost:3003${NC}"
}

# Função para iniciar Template Builder Backend
start_template_backend() {
    echo -e "${YELLOW}🚀 Iniciando Template Builder Backend...${NC}"
    cd "$TEMPLATE_BUILDER_DIR"
    npm run dev:back &
    sleep 3
    echo -e "${GREEN}✅ Template Builder Backend iniciado em http://localhost:3004${NC}"
}

# Função para iniciar Template Builder Frontend
start_template_frontend() {
    echo -e "${YELLOW}🚀 Iniciando Template Builder Frontend...${NC}"
    cd "$TEMPLATE_BUILDER_DIR"
    npm run dev:front &
    sleep 3
    echo -e "${GREEN}✅ Template Builder Frontend iniciado em http://localhost:3000${NC}"
}

# Função para iniciar Media Control
start_media_control() {
    echo -e "${YELLOW}🚀 Iniciando Media Control...${NC}"
    cd "$MEDIA_CONTROL_DIR"
    npm start &
    sleep 3
    echo -e "${GREEN}✅ Media Control iniciado em http://localhost:5002${NC}"
}

# Função para parar todos os processos Node
stop_all() {
    echo -e "${RED}🛑 Parando todos os processos Node.js...${NC}"
    pkill -f node
    pkill -f npm
    sleep 2
    echo -e "${GREEN}✅ Todos os processos foram finalizados${NC}"
}

# Função para reiniciar tudo
restart_all() {
    echo -e "${PURPLE}🔄 Reiniciando todos os módulos...${NC}"
    stop_all
    sleep 3
    start_admin_panel
    start_template_backend
    start_template_frontend
    start_media_control
    echo -e "${GREEN}✅ Todos os módulos foram reiniciados${NC}"
}

# Função para atualizar repositório
git_update() {
    echo -e "${BLUE}📥 Atualizando repositório...${NC}"
    cd "$ZENTRAW_DIR"
    git fetch origin
    git pull origin $(git branch --show-current)
    echo -e "${GREEN}✅ Repositório atualizado${NC}"
}

# Função para mostrar logs
show_logs() {
    echo -e "${BLUE}📋 Logs recentes dos processos Node.js:${NC}"
    ps aux | grep node | grep -v grep
}

# Menu principal
show_menu() {
    echo -e "${CYAN}Escolha uma opção:${NC}"
    echo -e "${YELLOW}1)${NC} 🔍 Verificar Status"
    echo -e "${YELLOW}2)${NC} 🚀 Iniciar Admin Panel"
    echo -e "${YELLOW}3)${NC} 🚀 Iniciar Template Builder Backend"
    echo -e "${YELLOW}4)${NC} 🚀 Iniciar Template Builder Frontend"
    echo -e "${YELLOW}5)${NC} 🚀 Iniciar Media Control"
    echo -e "${YELLOW}6)${NC} 🚀 Iniciar Todos os Módulos"
    echo -e "${YELLOW}7)${NC} 🛑 Parar Todos os Processos"
    echo -e "${YELLOW}8)${NC} 🔄 Reiniciar Todos os Módulos"
    echo -e "${YELLOW}9)${NC} 📥 Atualizar Repositório (Git Pull)"
    echo -e "${YELLOW}10)${NC} 📋 Mostrar Logs"
    echo -e "${YELLOW}0)${NC} ❌ Sair"
    echo ""
    read -p "Digite sua escolha [0-10]: " choice
}

# Loop principal
main() {
    show_header
    
    while true; do
        echo ""
        show_menu
        
        case $choice in
            1) check_status ;;
            2) start_admin_panel ;;
            3) start_template_backend ;;
            4) start_template_frontend ;;
            5) start_media_control ;;
            6) 
                start_admin_panel
                start_template_backend
                start_template_frontend
                start_media_control
                ;;
            7) stop_all ;;
            8) restart_all ;;
            9) git_update ;;
            10) show_logs ;;
            0) 
                echo -e "${GREEN}👋 Encerrando Zentraw Control Center...${NC}"
                exit 0
                ;;
            *) 
                echo -e "${RED}❌ Opção inválida. Tente novamente.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
