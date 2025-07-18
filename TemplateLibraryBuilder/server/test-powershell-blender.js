const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test PowerShell execution
console.log('🔄 Testing PowerShell Blender execution...');

const BLENDER_PATH = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';
const powershellCommand = `& "${BLENDER_PATH}" --version`;

console.log(`Command: ${powershellCommand}`);
console.log(`Path exists: ${fs.existsSync(BLENDER_PATH)}`);

const testProcess = spawn('powershell', ['-Command', powershellCommand], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

testProcess.stdout.on('data', (data) => {
  stdout += data.toString();
  console.log('STDOUT:', data.toString());
});

testProcess.stderr.on('data', (data) => {
  stderr += data.toString();
  console.error('STDERR:', data.toString());
});

testProcess.on('error', (error) => {
  console.error('❌ Process error:', error);
});

testProcess.on('close', (code) => {
  console.log(`✅ Process closed with code: ${code}`);
  console.log('Final stdout:', stdout);
  console.log('Final stderr:', stderr);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Timeout reached, killing process...');
  testProcess.kill();
}, 10000);
