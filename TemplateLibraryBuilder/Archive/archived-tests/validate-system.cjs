#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE VALIDAÇÃO COMPLETA - ZENTRAW 3D VISUALIZER V1.4.0.a.2
 * 
 * Implementa todas as verificações propostas pelo team AI:
 * - Verifica      });
      
    } catch (error) {
      console.log('❌ Erro de conectividade:', error.message);
      console.log('💡 Certifique-se de que o backend está rodando: npm run dev:back');e caminhos
 * - Teste de conectividade
 * - Validação do proxy de imagens
 * - Logs detalhados
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const TESTS = {
  BLENDER_PATH: 'C:\\Blender\\blender.exe',
  BLENDER_FALLBACK: 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe',
  BACKEND_URL: 'http://localhost:5000',
  FRONTEND_URL: 'http://localhost:5173'
};

class ZentrawValidator {
  constructor() {
    this.results = [];
  }
  
  async runAllTests() {
    console.log('🔥🔥 ZENTRAW 3D VISUALIZER - VALIDAÇÃO COMPLETA 🔥🔥');
    console.log('📅 Data:', new Date().toLocaleString());
    console.log('💻 Implementando soluções do team AI...\n');

    await this.testBlenderPaths();
    await this.testShortPath();
    await this.testBlenderExecution();
    await this.testBackendConnectivity();
    await this.testImageProxy();
    await this.generateSummary();
  }

  async testBlenderPaths() {
    console.log('📋 ===== TESTE 1: VERIFICAÇÃO DE CAMINHOS =====');
    
    // Teste caminho principal
    const mainPathExists = fs.existsSync(TESTS.BLENDER_PATH);
    console.log(`🔍 Caminho principal (C:\\Blender\\): ${mainPathExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
    if (mainPathExists) {
      const stats = fs.statSync(TESTS.BLENDER_PATH);
      console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`🔐 Permissions: ${stats.mode.toString(8)}`);
    }
    
    // Teste caminho fallback
    const fallbackExists = fs.existsSync(TESTS.BLENDER_FALLBACK);
    console.log(`🔍 Caminho original: ${fallbackExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
    this.results.push({
      test: 'Blender Paths',
      mainPath: mainPathExists,
      fallbackPath: fallbackExists,
      status: mainPathExists ? 'PASS' : (fallbackExists ? 'FALLBACK_AVAILABLE' : 'FAIL')
    });
    
    console.log('');
  }

  async testShortPath() {
    console.log('📋 ===== TESTE 2: CAMINHO CURTO DO WINDOWS =====');
    
    try {
      // Tentar obter caminho curto
      const result = execSync('dir /x "C:\\Program Files\\Blender Foundation\\Blender 4.5"', 
        { encoding: 'utf-8', timeout: 5000 });
      
      console.log('📝 Saída do comando dir /x:');
      console.log(result);
      
      // Procurar por padrão de caminho curto
      const shortPathMatch = result.match(/\\s+BLENDE~\\d+\\s+/);
      if (shortPathMatch) {
        console.log('✅ Caminho curto encontrado!');
        console.log('💡 Caminho sugerido: C:\\PROGRA~1\\BLENDE~1\\BLENDE~1\\blender.exe');
      } else {
        console.log('⚠️ Caminho curto não identificado automaticamente');
      }
      
      this.results.push({
        test: 'Short Path',
        found: !!shortPathMatch,
        output: result.slice(0, 200) + '...',
        status: shortPathMatch ? 'PASS' : 'PARTIAL'
      });
      
    } catch (error) {
      console.log('❌ Erro ao obter caminho curto:', error);
      this.results.push({
        test: 'Short Path',
        error: error,
        status: 'FAIL'
      });
    }
    
    console.log('');
  }

  async testBlenderExecution() {
    console.log('📋 ===== TESTE 3: EXECUÇÃO DO BLENDER =====');
    
    if (!fs.existsSync(TESTS.BLENDER_PATH)) {
      console.log('❌ Blender não encontrado - pulando teste de execução');
      this.results.push({
        test: 'Blender Execution',
        status: 'SKIPPED',
        reason: 'Blender not found'
      });
      console.log('');
      return;
    }

    try {
      console.log('🚀 Testando execução: blender --version');
      
      const versionOutput = execSync(`"${TESTS.BLENDER_PATH}" --version`, {
        encoding: 'utf-8',
        timeout: 10000
      });
      
      console.log('✅ Blender executou com sucesso!');
      console.log('📝 Saída:', versionOutput.split('\\n')[0]);
      
      this.results.push({
        test: 'Blender Execution',
        status: 'PASS',
        version: versionOutput.split('\\n')[0]
      });
      
    } catch (error) {
      console.log('❌ Falha na execução do Blender:', error.message);
      this.results.push({
        test: 'Blender Execution',
        status: 'FAIL',
        error: error.message
      });
    }
    
    console.log('');
  }

  async testBackendConnectivity() {
    console.log('📋 ===== TESTE 4: CONECTIVIDADE DO BACKEND =====');
    
    try {
      console.log(`🔗 Testando conexão: ${TESTS.BACKEND_URL}/health`);
      
      const response = await fetch(`${TESTS.BACKEND_URL}/health`, {
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend respondeu com sucesso!');
        console.log('📊 Resposta:', JSON.stringify(data, null, 2));
        
        this.results.push({
          test: 'Backend Connectivity',
          status: 'PASS',
          response: data
        });
      } else {
        console.log(`❌ Backend retornou status: ${response.status}`);
        this.results.push({
          test: 'Backend Connectivity',
          status: 'FAIL',
          httpStatus: response.status
        });
      }
      
    } catch (error) {
      console.log('❌ Erro de conectividade:', error.message);
      console.log('💡 Certifique-se de que o backend está rodando: npm run dev:back');
      
      this.results.push({
        test: 'Backend Connectivity',
        status: 'FAIL',
        error: error.message
      });
    }
    
    console.log('');
  }

  async testImageProxy() {
    console.log('📋 ===== TESTE 5: PROXY DE IMAGENS =====');
    
    try {
      // Verificar se diretório uploads existe
      const uploadsDir = path.join(process.cwd(), 'uploads', 'blender');
      console.log(`📁 Verificando diretório: ${uploadsDir}`);
      
      if (!fs.existsSync(uploadsDir)) {
        console.log('📁 Criando diretório uploads...');
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Criar arquivo de teste
      const testImagePath = path.join(uploadsDir, 'test_image.png');
      const testImageContent = Buffer.from('test image content');
      fs.writeFileSync(testImagePath, testImageContent);
      
      console.log('🖼️ Arquivo de teste criado');
      
      // Testar acesso via proxy
      const proxyUrl = `${TESTS.BACKEND_URL}/uploads/blender/test_image.png`;
      console.log(`🔗 Testando proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl, { timeout: 5000 });
      
      if (response.ok) {
        console.log('✅ Proxy de imagens funcionando!');
        this.results.push({
          test: 'Image Proxy',
          status: 'PASS',
          url: proxyUrl
        });
      } else {
        console.log(`❌ Proxy retornou status: ${response.status}`);
        this.results.push({
          test: 'Image Proxy',
          status: 'FAIL',
          httpStatus: response.status
        });
      }
      
      // Limpar arquivo de teste
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
      
    } catch (error) {
      console.log('❌ Erro no teste de proxy:', error.message);
      this.results.push({
        test: 'Image Proxy',
        status: 'FAIL',
        error: error.message
      });
    }
    
    console.log('');
  }

  async generateSummary() {
    console.log('📊 ===== RESUMO DOS TESTES =====');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const skipped = this.results.filter(r => r.status === 'SKIPPED').length;
    const partial = this.results.filter(r => r.status === 'PARTIAL').length;
    
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`⏭️ Pulado: ${skipped}`);
    console.log(`⚠️ Parcial: ${partial}`);
    
    const totalTests = this.results.length;
    const successRate = ((passed + partial * 0.5) / totalTests * 100).toFixed(1);
    
    console.log(`📈 Taxa de sucesso: ${successRate}%`);
    
    // Salvar relatório
    const reportPath = path.join(process.cwd(), 'validation_report.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: { passed, failed, skipped, partial, successRate },
      results: this.results
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Relatório salvo em: ${reportPath}`);
    
    // Recomendações
    console.log('\\n💡 ===== RECOMENDAÇÕES =====');
    
    if (failed === 0) {
      console.log('🎉 Todos os testes críticos passaram! Sistema pronto para uso.');
    } else {
      console.log('🔧 Ações necessárias:');
      
      this.results.forEach(result => {
        if (result.status === 'FAIL') {
          switch (result.test) {
            case 'Blender Paths':
              console.log('- Copie o Blender para C:\\Blender\\');
              break;
            case 'Blender Execution':
              console.log('- Verifique permissões e antivírus');
              break;
            case 'Backend Connectivity':
              console.log('- Inicie o backend: npm run dev:back');
              break;
            case 'Image Proxy':
              console.log('- Verifique configuração do express.static');
              break;
          }
        }
      });
    }
  }
}

// Executar validação se chamado diretamente
if (require.main === module) {
  const validator = new ZentrawValidator();
  validator.runAllTests().catch(console.error);
}

module.exports = { ZentrawValidator };
