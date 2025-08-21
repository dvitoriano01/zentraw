// Teste rápido do backend
console.log('🔍 Testando backend...');

fetch('http://localhost:5001/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend está rodando!', data);
  })
  .catch(error => {
    console.log('❌ Backend não está rodando:', error.message);
  });

fetch('http://localhost:5001/api/blender/test')
  .then(response => response.json())
  .then(data => {
    console.log('🔧 Blender test result:', data);
  })
  .catch(error => {
    console.log('❌ Blender test failed:', error.message);
  });
