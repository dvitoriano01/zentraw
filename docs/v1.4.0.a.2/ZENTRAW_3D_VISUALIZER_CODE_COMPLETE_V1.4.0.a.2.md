# ZENTRAW 3D VISUALIZER - CÓDIGO COMPLETO E ESTRUTURAS V1.4.0.a.2

## 📁 ESTRUTURA DE ARQUIVOS COMPLETA

### 1. SERVER BACKEND

#### `backend-only.ts` - Express Server Principal

```typescript
import express from "express";
import cors from "cors";
import path from "path";
import { blenderRouter } from "./routes/blender.js";

const app = express();
const PORT = 5001;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ✅ IMAGE PROXY IMPLEMENTATION - Static file serving
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, path) => {
      console.log("📁 Serving static file:", path);
    },
  })
);

// API routes
app.use("/api/blender", blenderRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(
    `📁 Static files served from: ${path.join(process.cwd(), "uploads")}`
  );
});
```

#### `blender-paths.ts` - Configuração de Paths

```typescript
import path from "path";

export const BLENDER_PATHS = {
  BLENDER_EXE:
    "C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe",
  SCRIPT_PATH: path.join(
    process.cwd(),
    "Blender",
    "render_audio_visualizer.py"
  ),
  TEMPLATE_PATH: path.join(process.cwd(), "Blender", "template.blend"),
};

console.log("🔄 BLENDER_PATHS loaded - Template:", BLENDER_PATHS.TEMPLATE_PATH);
```

#### `routes/blender.ts` - API Routes

```typescript
import express from "express";
import { BlenderService } from "../services/blender-service.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Test endpoint
router.get("/test", async (req, res) => {
  try {
    const isWorking = await BlenderService.testBlenderInstallation();
    res.json({
      success: isWorking,
      message: isWorking ? "Blender is working" : "Blender test failed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Preview generation endpoint
router.post(
  "/preview",
  upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const audioFile = files.audioFile?.[0];
      const imageFile = files.imageFile?.[0];

      if (!audioFile || !imageFile) {
        return res.status(400).json({
          success: false,
          error: "Audio and image files are required",
        });
      }

      const options = {
        audioFile: audioFile.path,
        imageFile: imageFile.path,
        renderEngine: (req.body.renderEngine || "eevee") as "eevee" | "cycles",
        cameraSettings: {
          distance: parseInt(req.body.distance) || 50,
          height: parseInt(req.body.height) || 50,
          angle: parseInt(req.body.angle) || 0,
        },
        animationStyle: (req.body.animationStyle || "cube") as
          | "cube"
          | "sphere"
          | "bars",
        sensitivity: parseInt(req.body.sensitivity) || 50,
        smoothing: parseInt(req.body.smoothing) || 30,
      };

      const blenderService = new BlenderService();
      const result = await blenderService.generatePreview(options);

      if (result.success && result.previewPath) {
        const filename = path.basename(result.previewPath);

        // ✅ IMAGE PROXY - Return URL for static serving
        const previewUrl = `/uploads/blender/${filename}`;

        res.json({
          success: true,
          previewUrl,
          renderTime: result.renderTime,
          message: "Preview generated successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || "Failed to generate preview",
        });
      }
    } catch (error) {
      console.error("❌ Preview generation error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export { router as blenderRouter };
```

### 2. BLENDER SERVICE - PROBLEMA CRÍTICO

#### `services/blender-service.ts` - Serviço Principal (ATUAL COM PROBLEMAS)

```typescript
import { spawn, execFile } from "child_process";
import path from "path";
import fs from "fs";
import { BLENDER_PATHS } from "../blender-paths.js";

export class BlenderService {
  private static readonly BLENDER_PATH = BLENDER_PATHS.BLENDER_EXE;
  private static readonly SCRIPT_PATH = BLENDER_PATHS.SCRIPT_PATH;
  private static readonly DEFAULT_TEMPLATE = BLENDER_PATHS.TEMPLATE_PATH;

  // ❌ PROBLEMA: Este método falha na execução do Blender
  private static executeBlender(
    templatePath: string,
    scriptArgs: string[]
  ): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const args = [
        "--background",
        templatePath,
        "--python",
        this.SCRIPT_PATH,
        "--",
        ...scriptArgs,
      ];

      console.log(`Executing: ${this.BLENDER_PATH} ${args.join(" ")}`);

      // ❌ PROBLEMA: spawn falha com paths que têm espaços
      const blenderProcess = spawn(this.BLENDER_PATH, args, {
        stdio: ["pipe", "pipe", "pipe"],
        shell: true, // Tentativa atual - não resolve
      });

      // Timeout e error handling
      let hasError = false;
      const timeout = setTimeout(() => {
        console.log("⏰ Blender process timeout, killing...");
        blenderProcess.kill("SIGTERM");
        hasError = true;
      }, 30000);

      blenderProcess.on("error", (error) => {
        console.error("❌ Blender spawn error:", error.message);
        clearTimeout(timeout);
        hasError = true;
        resolve({
          success: false,
          error: `Failed to start Blender: ${error.message}`,
        });
      });

      blenderProcess.on("close", (code) => {
        clearTimeout(timeout);
        if (hasError) return;

        if (code === 0) {
          console.log("✅ Blender process completed successfully");
          resolve({ success: true });
        } else {
          console.error(`❌ Blender process exited with code ${code}`);
          resolve({
            success: false,
            error: `Blender process failed with exit code ${code}`,
          });
        }
      });
    });
  }

  // ❌ PROBLEMA: generatePreview usa execFile que também falha
  async generatePreview(options: PreviewOptions): Promise<PreviewResult> {
    const startTime = Date.now();
    const timestamp = Date.now();
    const uploadsDir = path.join(process.cwd(), "uploads", "blender");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const outputPath = path.join(uploadsDir, `preview_${timestamp}.png`);
    const templatePath = path.join(process.cwd(), "Blender", "template.blend");

    return new Promise((resolve) => {
      const args = [
        "--background",
        templatePath,
        "--python",
        path.join(process.cwd(), "Blender", "preview_script.py"),
        "--",
        outputPath,
      ];

      // ❌ PROBLEMA: execFile também falha com paths com espaços
      const blenderProcess = execFile(
        BlenderService.BLENDER_PATH,
        args,
        {
          maxBuffer: 1024 * 1024 * 10,
          timeout: 30000,
        },
        (error, stdout, stderr) => {
          const renderTime = Date.now() - startTime;

          if (error) {
            console.error(`❌ Blender execFile error:`, error);
            resolve({
              success: false,
              error: `Blender execution failed: ${error.message}`,
              renderTime,
            });
            return;
          }

          if (fs.existsSync(outputPath)) {
            resolve({
              success: true,
              previewPath: outputPath,
              renderTime,
            });
          } else {
            resolve({
              success: false,
              error: `Preview file was not generated. Stderr: ${stderr}`,
              renderTime,
            });
          }
        }
      );
    });
  }
}
```

### 3. FRONTEND CLIENT

#### `client/components/blender-visualizer.tsx` - Interface React

```typescript
import React, { useState, useRef } from "react";

interface BlenderVisualizerProps {
  // Props interface
}

export const BlenderVisualizer: React.FC<BlenderVisualizerProps> = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      // Adicionar arquivos e configurações

      const response = await fetch("/api/blender/preview", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // ✅ IMAGE PROXY - Usar URL completa para acessar imagem
        const fullUrl = `http://localhost:5001${result.previewUrl}`;
        setPreviewUrl(fullUrl);
      } else {
        setError(result.error || "Failed to generate preview");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="blender-visualizer">
      <button
        onClick={generatePreview}
        disabled={isGenerating}
        className="generate-btn"
      >
        {isGenerating ? "Generating..." : "Generate Preview"}
      </button>

      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="3D Preview" />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
```

### 4. BLENDER INTEGRATION

#### `Blender/preview_script.py` - Script Python para Preview

```python
import bpy
import sys
import os

def render_preview(output_path):
    """Renderiza um frame de preview"""
    try:
        # Configurar render settings
        bpy.context.scene.render.engine = 'EEVEE'
        bpy.context.scene.render.resolution_x = 800
        bpy.context.scene.render.resolution_y = 600
        bpy.context.scene.render.filepath = output_path

        # Renderizar
        bpy.ops.render.render(write_still=True)
        print(f"Preview rendered: {output_path}")

    except Exception as e:
        print(f"Error rendering preview: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        output_path = sys.argv[1]
        render_preview(output_path)
    else:
        print("Usage: blender --background template.blend --python preview_script.py -- output.png")
        sys.exit(1)
```

#### `Blender/template.blend` - Arquivo 3D Template

```
[ARQUIVO BINÁRIO BLENDER]
- Contém setup 3D para visualização
- Configurações de câmera, luzes, materiais
- Objetos 3D preparados para audio visualization
- Funcionou perfeitamente ontem (16/07/2025)
```

## 🔍 ANÁLISE DE PROBLEMAS

### 1. WINDOWS PATH ISSUE - ANÁLISE DETALHADA

```typescript
// ❌ PROBLEMA: Path com espaços não funciona
const BLENDER_PATH =
  "C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe";

// Tentativas que falharam:
spawn(BLENDER_PATH, args, { shell: false }); // Falha: comando não encontrado
spawn(BLENDER_PATH, args, { shell: true }); // Falha: exit code 1
execFile(BLENDER_PATH, args); // Falha: não inicia processo

// ✅ SOLUÇÕES POSSÍVEIS:
// 1. Usar path curto do Windows
const SHORT_PATH = "C:\\PROGRA~1\\BLENDE~1\\BLENDE~1\\blender.exe";

// 2. Usar PowerShell
const powershell = spawn("powershell", [
  "-Command",
  `& "${BLENDER_PATH}" ${args.join(" ")}`,
]);

// 3. Usar util.promisify com exec
const exec = util.promisify(require("child_process").exec);
const result = await exec(`"${BLENDER_PATH}" ${args.join(" ")}`);
```

### 2. PROCESS EXECUTION PATTERNS

```typescript
// ✅ FUNCIONOU ONTEM (16/07/2025)
// Alguma configuração específica que permitiu execução

// ❌ FALHA HOJE (17/07/2025)
// Mesma configuração não funciona mais

// POSSÍVEIS CAUSAS:
// - Windows Update
// - Node.js version change
// - Environment variables
// - Process permissions
// - Antivirus interference
```

### 3. IMAGE PROXY STATUS

```typescript
// ✅ IMPLEMENTADO CORRETAMENTE
// Backend: express.static middleware
// Frontend: Full URL usage
// Routes: Correct URL generation

// ❌ NÃO TESTÁVEL
// Depende de Blender execution working
// Não pode gerar arquivos para servir
```

## 🚨 DEBUGGING CHECKLIST

### 1. VERIFICAÇÕES BÁSICAS

- [ ] Blender executable exists: `fs.existsSync(BLENDER_PATH)`
- [ ] Template file exists: `fs.existsSync(TEMPLATE_PATH)`
- [ ] Python script exists: `fs.existsSync(SCRIPT_PATH)`
- [ ] Permissions adequadas
- [ ] Antivirus não bloqueando

### 2. PROCESS DEBUGGING

```typescript
// Adicionar logs detalhados
console.log("PWD:", process.cwd());
console.log("PATH:", process.env.PATH);
console.log("Platform:", process.platform);
console.log("Node version:", process.version);

// Testar comando direto
const testCommand = `"${BLENDER_PATH}" --version`;
console.log("Test command:", testCommand);
```

### 3. ALTERNATIVE APPROACHES

```typescript
// 1. cross-spawn package
import spawn from "cross-spawn";
const process = spawn(BLENDER_PATH, args);

// 2. shelljs
import shell from "shelljs";
const result = shell.exec(`"${BLENDER_PATH}" ${args.join(" ")}`);

// 3. node-cmd
import cmd from "node-cmd";
cmd.get(`"${BLENDER_PATH}" ${args.join(" ")}`, callback);
```

## 🎯 NEXT ACTIONS

### 1. IMMEDIATE FIXES NEEDED

1. **Resolve Blender execution** - Priority #1
2. **Test alternative spawn methods** - Priority #2
3. **Validate image proxy end-to-end** - Priority #3

### 2. IMPLEMENTATION PLAN

```typescript
// Step 1: Try cross-spawn
npm install cross-spawn
import spawn from 'cross-spawn';

// Step 2: Try short path
const BLENDER_SHORT = 'C:\\PROGRA~1\\BLENDE~1\\BLENDE~1\\blender.exe';

// Step 3: Try PowerShell wrapper
const powershellExec = (command: string) => {
  return spawn('powershell', ['-Command', command]);
};
```

### 3. SUCCESS CRITERIA

- [ ] Blender executes without errors
- [ ] Preview image generated successfully
- [ ] Image proxy serves file correctly
- [ ] Frontend displays preview
- [ ] 3D Visualizer V1.4.0.a.2 = 100% functional

---

**Status**: COMPREHENSIVE ANALYSIS COMPLETE  
**Blocker**: Windows Blender execution via child_process  
**Solution**: Implement alternative process execution method  
**Timeline**: Critical - needs immediate resolution
