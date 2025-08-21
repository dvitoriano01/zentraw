const express = require('express');
const cors = require('cors');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // Dashboard principal

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração dos módulos Zentraw
const MODULES = {
  'admin-panel': {
    name: 'Admin Panel',
    port: 3003,
    path: '../../Admin_Panel',
    command: 'npm start',
    icon: '🔧',
    description: 'Central Admin Panel with API Manager',
    status: 'stopped'
  },
  'template-builder': {
    name: 'Template Library Builder',
    port: 3004,
    path: '../../TemplateLibraryBuilder',
    command: 'node server-simple-real.js',
    icon: '🏗️',
    description: 'Template creation and management system',
    status: 'stopped'
  },
  '3d-visualizer': {
    name: '3D Visualizer',
    port: 3005,
    path: '/mnt/c/Users/Denys Victoriano/Documents/GitHub/clone/gsap-threejs-inertia_DENYS/Grok_Blender_Integration',
    command: 'python3 backend/run_pipeline.py',
    icon: '🎬',
    description: '3D visualization with Blender integration',
    status: 'stopped'
  },
  'music-intelligence': {
    name: 'Music Intelligence',
    port: 3006,
    path: '../music_intelligence',
    command: 'npm start',
    icon: '🎵',
    description: 'AI-powered music analysis and generation',
    status: 'stopped'
  }
};

let activeProcesses = new Map();

// Middleware para logs
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Função para verificar se uma porta está em uso
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const ss = spawn('ss', ['-tlnp']);
    let output = '';
    
    ss.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ss.on('close', () => {
      const isUsed = output.includes(`:${port} `) && output.includes('LISTEN');
      resolve(isUsed);
    });
    
    ss.on('error', () => {
      resolve(false);
    });
  });
}

// Função para parar todos os processos Node.js exceto o dashboard
async function stopAllModules() {
  try {
    // Para processos ativos rastreados
    for (let [moduleId, process] of activeProcesses) {
      if (process && !process.killed) {
        process.kill();
        console.log(`🛑 Stopped module: ${moduleId}`);
      }
    }
    activeProcesses.clear();

    // Para todos os processos Node.js nas portas específicas
    const ports = Object.values(MODULES).map(m => m.port);
    for (const port of ports) {
      await killProcessOnPort(port);
    }

    // Atualiza status de todos os módulos
    Object.keys(MODULES).forEach(moduleId => {
      MODULES[moduleId].status = 'stopped';
    });

    console.log('✅ All modules stopped successfully');
    return true;
  } catch (error) {
    console.error('❌ Error stopping modules:', error);
    return false;
  }
}

// Função para matar processo em uma porta específica
async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        lines.forEach(line => {
          if (line.includes('LISTENING')) {
            const pid = line.trim().split(/\s+/).pop();
            if (pid && pid !== '0') {
              exec(`taskkill /PID ${pid} /F`, (killError) => {
                if (!killError) {
                  console.log(`🔪 Killed process on port ${port} (PID: ${pid})`);
                }
              });
            }
          }
        });
      }
      resolve();
    });
  });
}

// Função para iniciar um módulo
async function startModule(moduleId) {
  try {
    const module = MODULES[moduleId];
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    // Para todos os outros módulos primeiro
    await stopAllModules();
    
    // Aguarda um momento para garantir que as portas foram liberadas
    await new Promise(resolve => setTimeout(resolve, 2000));

    const modulePath = path.resolve(__dirname, module.path);
    
    // Verifica se o diretório existe
    if (!fs.existsSync(modulePath)) {
      throw new Error(`Module path not found: ${modulePath}`);
    }

    console.log(`🚀 Starting module: ${module.name}`);
    console.log(`📍 Path: ${modulePath}`);
    console.log(`🔧 Command: ${module.command}`);

    // Executa o comando do módulo
    const [cmd, ...args] = module.command.split(' ');
    const childProcess = spawn(cmd, args, {
      cwd: modulePath,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    // Armazena o processo
    activeProcesses.set(moduleId, childProcess);
    module.status = 'starting';

    // Logs do processo
    childProcess.stdout.on('data', (data) => {
      console.log(`[${moduleId}] ${data.toString()}`);
    });

    childProcess.stderr.on('data', (data) => {
      console.error(`[${moduleId}] ERROR: ${data.toString()}`);
    });

    childProcess.on('close', (code) => {
      console.log(`[${moduleId}] Process exited with code ${code}`);
      module.status = 'stopped';
      activeProcesses.delete(moduleId);
    });

    childProcess.on('error', (error) => {
      console.error(`[${moduleId}] Process error:`, error);
      module.status = 'error';
      activeProcesses.delete(moduleId);
    });

    // Aguarda um tempo para o módulo iniciar
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verifica se a porta está ativa
    const isRunning = await isPortInUse(module.port);
    module.status = isRunning ? 'running' : 'error';

    console.log(`✅ Module ${module.name} status: ${module.status}`);
    return { success: true, status: module.status };

  } catch (error) {
    console.error(`❌ Error starting module ${moduleId}:`, error);
    MODULES[moduleId].status = 'error';
    return { success: false, error: error.message };
  }
}

// Routes

// Dashboard principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Obter status de todos os módulos
app.get('/api/modules', async (req, res) => {
  // Atualiza status baseado nas portas
  for (const [moduleId, module] of Object.entries(MODULES)) {
    const isRunning = await isPortInUse(module.port);
    if (isRunning && module.status !== 'running') {
      module.status = 'running';
    } else if (!isRunning && module.status === 'running') {
      module.status = 'stopped';
    }
  }
  
  res.json(MODULES);
});

// API: Iniciar módulo específico
app.post('/api/modules/:moduleId/start', async (req, res) => {
  const { moduleId } = req.params;
  console.log(`🎯 Request to start module: ${moduleId}`);
  
  const result = await startModule(moduleId);
  res.json(result);
});

// API: Parar todos os módulos
app.post('/api/modules/stop-all', async (req, res) => {
  console.log(`🛑 Request to stop all modules`);
  
  const success = await stopAllModules();
  res.json({ success });
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    activeModules: Array.from(activeProcesses.keys())
  });
});

// API: System info
app.get('/api/system', (req, res) => {
  const os = require('os');
  res.json({
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + ' GB',
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + ' GB',
    uptime: Math.round(os.uptime() / 3600) + ' hours'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Zentraw Dashboard...');
  await stopAllModules();
  process.exit(0);
});

// COMENTADO TEMPORARIAMENTE PARA AUTOMAÇÃO
// process.on('SIGTERM', async () => {
//   console.log('\n🛑 Shutting down Zentraw Dashboard...');
//   await stopAllModules();
//   process.exit(0);
// });

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎨 ZENTRAW ECOSYSTEM DASHBOARD');
  console.log('='.repeat(60));
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🎯 Dashboard ready to manage ${Object.keys(MODULES).length} modules`);
  console.log('='.repeat(60));
  console.log('\n📋 Available modules:');
  Object.entries(MODULES).forEach(([id, module]) => {
    console.log(`   ${module.icon} ${module.name} (port ${module.port})`);
  });
  console.log('\n✨ Ready to launch modules one at a time!');
  console.log('='.repeat(60));
});
