const { spawn } = require('child_process');

console.log('Testing Blender with spawn...');

const blenderPath = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';
console.log('Blender path:', blenderPath);

const proc = spawn(blenderPath, ['--version'], { 
  stdio: 'inherit',
  shell: false 
});

proc.on('error', (err) => {
  console.error('Error:', err);
});

proc.on('close', (code) => {
  console.log('Exit code:', code);
});

proc.on('exit', (code) => {
  console.log('Process exited with code:', code);
});
