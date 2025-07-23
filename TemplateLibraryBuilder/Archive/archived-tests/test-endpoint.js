// 🧪 TESTE DIRETO DO ENDPOINT BLENDER
// Mudando para sintaxe CommonJS devido ao ES module

const fetch = require('node-fetch');

console.log('🔥 ZENTRAW V1.4.0.a.2 - TESTE DO ENDPOINT');
console.log('📅', new Date().toLocaleString());
console.log('');

async function testEndpoint() {
  try {
    console.log('🔗 Tentando conectar em http://localhost:5000/health...');
    
    const response = await fetch('http://localhost:5000/health', {
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend respondeu!');
      console.log('📊 Resposta:', JSON.stringify(data, null, 2));
      
      // Testar endpoint do Blender
      console.log('\n🧪 Testando endpoint do Blender...');
      const blenderResponse = await fetch('http://localhost:5000/api/blender/test');
      
      if (blenderResponse.ok) {
        const blenderData = await blenderResponse.json();
        console.log('✅ Endpoint Blender funcionando!');
        console.log('📊 Resultado:', JSON.stringify(blenderData, null, 2));
      } else {
        console.log('❌ Endpoint Blender falhou');
      }
      
    } else {
      console.log(`❌ Backend retornou status: ${response.status}`);
    }
    
  } catch (error) {
    console.log('❌ Erro de conectividade:', error.message);
    console.log('💡 O backend precisa estar rodando primeiro!');
    console.log('🚀 Execute: npm run dev:back');
  }
}

testEndpoint();
