#!/usr/bin/env node

/**
 * 🛡️ ZENTRAW PORT MANAGER V2.0
 * Sistema inteligente de gerenciamento de portas
 * Prevenção automática de conflitos e processos zumbis
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ZentrawPortManager {
  constructor() {
    this.ports = {
      agent: 3007,
      admin: 3003,
      template: 3004,
      visualizer: 3005,
      music: 3006
    };
    
    this.logFile = path.join(__dirname, 'port-manager.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logEntry);
  }

  checkPort(port) {
    try {
      const result = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
      return result.trim() ? { occupied: true, pid: result.trim() } : { occupied: false };
    } catch (error) {
      return { occupied: false };
    }
  }

  killProcess(pid) {
    try {
      execSync(`kill -9 ${pid}`);
      this.log(`✅ Processo ${pid} eliminado com sucesso`);
      return true;
    } catch (error) {
      this.log(`❌ Erro ao eliminar processo ${pid}: ${error.message}`);
      return false;
    }
  }

  findAlternativePort(basePort) {
    for (let port = basePort + 1; port <= basePort + 100; port++) {
      const status = this.checkPort(port);
      if (!status.occupied) {
        return port;
      }
    }
    throw new Error(`Nenhuma porta disponível próxima a ${basePort}`);
  }

  resolvePortConflict(service, port) {
    this.log(`🔍 Verificando porta ${port} para ${service}...`);
    
    const status = this.checkPort(port);
    
    if (!status.occupied) {
      this.log(`✅ Porta ${port} livre para ${service}`);
      return { port, action: 'none' };
    }

    this.log(`⚠️ Porta ${port} ocupada pelo PID ${status.pid}`);
    
    // Tentar eliminar processo zumbi
    if (this.killProcess(status.pid)) {
      // Aguardar e verificar novamente
      setTimeout(() => {}, 1000);
      const recheck = this.checkPort(port);
      
      if (!recheck.occupied) {
        this.log(`✅ Porta ${port} liberada para ${service}`);
        return { port, action: 'killed_process' };
      }
    }

    // Se não conseguiu liberar, encontrar porta alternativa
    const altPort = this.findAlternativePort(port);
    this.log(`🔄 Porta alternativa ${altPort} encontrada para ${service}`);
    return { port: altPort, action: 'alternative_port' };
  }

  checkAllPorts() {
    this.log('🔍 ZENTRAW PORT MANAGER - Verificação Completa');
    this.log('===============================================');

    const results = {};
    
    for (const [service, port] of Object.entries(this.ports)) {
      results[service] = this.resolvePortConflict(service, port);
    }

    return results;
  }

  generateStartupScript(results) {
    const scriptPath = path.join(__dirname, 'start-zentraw-managed.js');
    let script = `#!/usr/bin/env node\n\n`;
    script += `// Gerado automaticamente pelo Zentraw Port Manager\n`;
    script += `// Data: ${new Date().toISOString()}\n\n`;

    for (const [service, result] of Object.entries(results)) {
      script += `console.log('🚀 Iniciando ${service} na porta ${result.port}');\n`;
      
      if (result.action === 'alternative_port') {
        script += `console.log('⚠️ ${service}: Usando porta alternativa ${result.port}');\n`;
      }
    }

    fs.writeFileSync(scriptPath, script);
    this.log(`📄 Script de inicialização gerado: ${scriptPath}`);
    
    return scriptPath;
  }

  monitor() {
    this.log('👁️ Iniciando monitoramento contínuo...');
    
    setInterval(() => {
      for (const [service, port] of Object.entries(this.ports)) {
        const status = this.checkPort(port);
        if (status.occupied) {
          this.log(`📊 ${service}:${port} - ATIVO (PID: ${status.pid})`);
        }
      }
    }, 60000); // Verifica a cada minuto
  }
}

// Exportar para uso como módulo
module.exports = ZentrawPortManager;

// Executar diretamente se chamado via linha de comando
if (require.main === module) {
  const manager = new ZentrawPortManager();
  const results = manager.checkAllPorts();
  
  console.log('\n🎯 RELATÓRIO FINAL:');
  console.log('==================');
  
  for (const [service, result] of Object.entries(results)) {
    console.log(`${service}: porta ${result.port} (${result.action})`);
  }
  
  manager.generateStartupScript(results);
  
  // Perguntar se deve iniciar monitoramento
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\n👁️ Iniciar monitoramento contínuo? (s/N): ', (answer) => {
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
      manager.monitor();
      console.log('🔄 Monitoramento ativo. Pressione Ctrl+C para parar.');
    } else {
      console.log('✅ Port Manager finalizado.');
      process.exit(0);
    }
    rl.close();
  });
}
