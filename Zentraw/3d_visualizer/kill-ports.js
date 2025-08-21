const { execSync } = require('child_process');
const killPort = require('kill-port');

const PORTS = [3004, 3005, 3006];

async function liberarPorta(port) {
  try {
    console.log(`Tentando liberar a porta ${port}...`);
    await killPort(port, 'tcp');
    console.log(`Porta ${port} liberada com sucesso.`);
  } catch (err) {
    console.error(`Erro ao liberar a porta ${port}:`, err);
    try {
      const output = execSync(`netstat -a -n -o | find "${port}"`).toString();
      const lines = output.split('\n');
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          console.log(`Matando processo com PID ${pid} na porta ${port}...`);
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
        }
      });
      console.log('Reiniciando serviço de rede...');
      execSync('net stop winnat && net start winnat', { stdio: 'inherit' });
      console.log(`Porta ${port} liberada com sucesso.`);
    } catch (innerErr) {
      console.error('Nenhum processo encontrado na porta ou erro ao matar:', innerErr);
    }
  }
}

(async () => {
  for (const port of PORTS) {
    await liberarPorta(port);
  }
  console.log('Todas as portas liberadas!');
})();
