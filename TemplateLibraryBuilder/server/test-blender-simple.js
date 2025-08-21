const { spawn } = require('child_process');
const fs = require('fs');

const blenderPath = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';

console.log('Testing Blender installation...');
console.log('Path:', blenderPath);
console.log('Exists:', fs.existsSync(blenderPath));

if (fs.existsSync(blenderPath)) {
  console.log('File exists, testing spawn...');
  
  const proc = spawn(blenderPath, ['--version'], { 
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: false 
  });
  
  let stdout = '';
  let stderr = '';
  
  proc.stdout.on('data', (data) => {
    stdout += data.toString();
  });
  
  proc.stderr.on('data', (data) => {
    stderr += data.toString();
  });
  
  proc.on('error', (err) => {
    console.error('❌ Error:', err.message);
  });
  
  proc.on('close', (code) => {
    console.log('✅ Process closed with code:', code);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  });
  
  // Timeout after 10 seconds
  setTimeout(() => {
    console.log('Timeout reached, killing process...');
    proc.kill();
  }, 10000);
} else {
  console.log('❌ Blender not found at path');
}
