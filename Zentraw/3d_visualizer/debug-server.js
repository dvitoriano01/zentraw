/**
 * ZENTRAW DEBUG SERVER - IDENTIFICAR ERRO UNDEFINED
 * V1.4.0.a.8.2 - DEBUG CRÍTICO
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3004;
const currentDir = __dirname;

console.log("🔍 DEBUG CRÍTICO - ZENTRAW V1.4.0.a.8.2");
console.log(`📂 currentDir: ${currentDir}`);
console.log(`📂 __dirname: ${__dirname}`);
console.log(`🌐 Porta: ${PORT}`);

// Testar path operations
try {
    const testOutputs = path.join(currentDir, "outputs");
    console.log(`✅ path.join funcionando: ${testOutputs}`);
    
    const testUploads = path.join(currentDir, "uploads");  
    console.log(`✅ uploads path: ${testUploads}`);
    
    const testBlender = path.join(currentDir, "Blender");
    console.log(`✅ blender path: ${testBlender}`);
    
} catch (error) {
    console.log(`❌ ERRO no path.join: ${error.message}`);
}

app.get("/", (req, res) => {
    res.send(`
        <h1>ZENTRAW DEBUG V1.4.0.a.8.2</h1>
        <p>currentDir: ${currentDir}</p>
        <p>__dirname: ${__dirname}</p>
        <p>Status: ✅ FUNCIONANDO</p>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 ZENTRAW DEBUG V1.4.0.a.8.2 rodando na porta ${PORT}`);
    console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
