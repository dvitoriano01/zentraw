# 3D Visualizer - Especificações Técnicas

## Arquitetura do Sistema

### Stack Tecnológico

#### Frontend
- **Framework**: React 18.2+ com TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Shadcn/ui (Radix UI base)
- **Icons**: Lucide React
- **File Handling**: HTML5 File API

#### Backend
- **Runtime**: Node.js 22.16.0+
- **Framework**: Express.js
- **TypeScript**: TSX para hot reload
- **File Upload**: Multer
- **Process Management**: Child Process para Blender

#### 3D Engine
- **Software**: Blender 3.x+ (EEVEE_NEXT support required)
- **Scripting**: Python inline scripts
- **Render Engine**: BLENDER_EEVEE_NEXT
- **Output**: PNG images

---

## Estrutura de Dados

### RenderSettings Interface
```typescript
interface RenderSettings {
  // Camera Position
  cameraDistance: number;      // 0-20, default: 10
  cameraHeight: number;        // 0-20, default: 10  
  cameraAngle: number;         // 0-360, default: 45
  
  // Camera Rotation
  rotationX: number;           // -90 to 90, default: 0
  rotationY: number;           // 0-360, default: 0
  rotationZ: number;           // -180 to 180, default: 0
  
  // Render Settings
  resolution: '720p' | '1080p' | '4k';
  quality: 'fast' | 'balanced' | 'high';
  animationStyle: 'none' | 'rotate' | 'pulse' | 'cube';
  
  // Audio Analysis
  sensitivity: number;         // 0-100, default: 50
  smoothing: number;           // 0-100, default: 30
  frequencyRange: 'bass' | 'mid' | 'treble' | 'full';
}
```

### API Response Format
```typescript
interface BlenderResponse {
  success: boolean;
  previewUrl?: string;         // "/api/blender/download/preview_[timestamp].png"
  previewPath?: string;        // Absolute file path
  renderTime?: number;         // Milliseconds
  message?: string;
  error?: string;
}
```

---

## Configuração de Rede

### Portas e Endpoints

#### Backend (Port 5001)
```
GET  /api/blender/test           # Health check
POST /api/blender/preview        # Generate preview
POST /api/blender/render         # Full render
GET  /api/blender/download/:file # File download
```

#### Frontend (Dynamic Port)
```
Vite Auto: 5173, 5174, 5175, 5176...
Proxy: /api/* → http://localhost:5001
```

### CORS Configuration
```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176'
];
```

---

## Sistema de Arquivos

### Estrutura de Diretórios
```
TemplateLibraryBuilder/
├── client/src/pages/
│   └── blender-visualizer.tsx        # 847 lines
├── server/
│   ├── backend-only.ts              # 48 lines
│   ├── services/blender-service.ts  # 442 lines
│   └── blender-paths.ts             # Config paths
├── Blender/
│   └── template.blend               # 760KB
└── uploads/blender/
    ├── audio_[timestamp].[ext]      # Uploaded audio
    ├── image_[timestamp].[ext]      # Uploaded images
    └── preview_[timestamp].png      # Generated previews
```

### Configuração de Caminhos
```typescript
// blender-paths.ts
export const BLENDER_PATHS = {
  BLENDER_EXE: 'blender',
  TEMPLATE_PATH: path.join(process.cwd(), 'Blender', 'template.blend'),
  SCRIPT_PATH: path.join(process.cwd(), 'uploads', 'blender'),
  UPLOADS_DIR: path.join(process.cwd(), 'uploads', 'blender')
};
```

---

## Processo de Render

### Workflow Detalhado

#### 1. Upload de Arquivos
```typescript
// Frontend -> Backend
FormData {
  audio: File,    // MP3, WAV, etc.
  image: File,    // PNG, JPG, etc.
  settings: JSON  // RenderSettings object
}
```

#### 2. Geração de Script Python
```python
# Dynamically generated script
import bpy
import os

# Load template
bpy.ops.wm.open_mainfile(filepath='[TEMPLATE_PATH]')

# Configure render engine
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'

# Set camera position
camera = bpy.data.objects['Camera']
camera.location = ([X], [Y], [Z])
camera.rotation_euler = ([RX], [RY], [RZ])

# Configure render settings
bpy.context.scene.render.resolution_x = [WIDTH]
bpy.context.scene.render.resolution_y = [HEIGHT]
bpy.context.scene.render.filepath = '[OUTPUT_PATH]'

# Render
bpy.ops.render.render(write_still=True)
```

#### 3. Execução Blender
```typescript
// BlenderService.generatePreview()
const blenderCommand = [
  BLENDER_PATH,
  templatePath,
  '--background',
  '--python-expr', pythonScript
];

const result = spawn(blenderCommand[0], blenderCommand.slice(1));
```

#### 4. Resposta e Download
```typescript
// API Response
{
  success: true,
  previewUrl: '/api/blender/download/preview_1752713366449.png',
  renderTime: 2593,
  message: 'Preview generated with EEVEE in 2593ms'
}
```

---

## Performance Specifications

### Benchmarks Atuais

#### Render Times
- **Preview (1080p)**: ~2.5s
- **High Quality**: ~5-8s (estimated)
- **4K**: ~15-30s (estimated)

#### Memory Usage
- **Backend**: ~50-100MB baseline
- **Blender Process**: ~200-500MB during render
- **Frontend**: ~30-50MB

#### File Sizes
- **Template**: 760KB
- **Generated Previews**: 50-200KB (PNG)
- **Audio Files**: Variable (user upload)
- **Image Files**: Variable (user upload)

### Limites de Sistema
```typescript
// Multer configuration
const upload = multer({
  dest: 'uploads/blender/',
  limits: {
    fileSize: 50 * 1024 * 1024,  // 50MB max file size
    files: 2                      // Audio + Image
  }
});
```

---

## Configuração de Desenvolvimento

### Environment Variables
```bash
NODE_ENV=development    # Enables detailed logging
PORT=5001              # Backend port (optional)
BLENDER_PATH=blender   # Custom Blender executable path
```

### Scripts NPM
```json
{
  "dev:back": "set NODE_ENV=development && tsx server/backend-only.ts",
  "dev:front": "vite",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
}
```

### VSCode Tasks
```json
{
  "label": "Start Zentraw Backend V1.4.0",
  "type": "shell", 
  "command": "cd TemplateLibraryBuilder && npm run dev:back",
  "group": "build",
  "isBackground": true
}
```

---

## Configuração de Produção

### Build Process
```bash
# 1. Build frontend
npm run build

# 2. Copy Blender assets
cp -r Blender/ dist/
cp -r uploads/ dist/

# 3. Configure paths for production
export NODE_ENV=production
export BLENDER_PATH=/usr/bin/blender  # Linux
```

### Deployment Considerations
1. **Blender Installation**: Required on production server
2. **File Permissions**: Write access to uploads directory  
3. **Process Memory**: ~500MB per concurrent render
4. **Storage**: Generated files cleanup strategy needed
5. **Load Balancing**: Render queue for multiple users

---

## Segurança

### File Upload Security
```typescript
// File type validation
const allowedMimeTypes = [
  'audio/mpeg', 'audio/wav', 'audio/mp3',
  'image/png', 'image/jpeg', 'image/jpg'
];

// File size limits
const maxFileSize = 50 * 1024 * 1024; // 50MB

// Path sanitization
const sanitizedFileName = path.basename(originalName);
```

### Script Injection Prevention
```typescript
// Python script templates with parameter validation
const pythonScript = `
import bpy

# Safe parameter insertion
camera_x = ${parseFloat(settings.cameraDistance)}
camera_y = ${parseFloat(settings.cameraHeight)}
camera_z = ${parseFloat(settings.cameraAngle)}

# Validate ranges
if not (0 <= camera_x <= 20):
    raise ValueError("Invalid camera_x range")
`;
```

---

## Monitoramento e Logs

### Backend Logging
```typescript
console.log('🎬 Preview generation request received');
console.log('📝 Request files:', req.files);
console.log('📝 Request body:', req.body);
console.log('⚡ Using Eevee Next engine');
console.log('✅ Preview generated successfully');
```

### Error Tracking
```typescript
try {
  // Blender execution
} catch (error) {
  console.error('❌ Preview generation failed:', error);
  return res.status(500).json({
    success: false,
    error: error.message
  });
}
```

### Performance Monitoring
```typescript
const startTime = Date.now();
// ... render process ...
const renderTime = Date.now() - startTime;
console.log(`🕐 Render completed in ${renderTime}ms`);
```

---

## Extensibilidade

### Plugin Architecture
```typescript
interface BlenderPlugin {
  name: string;
  version: string;
  execute(settings: RenderSettings): Promise<BlenderResponse>;
}

// Future: Support for custom render plugins
class CustomMaterialPlugin implements BlenderPlugin {
  // Custom material application logic
}
```

### Template System
```
Blender/templates/
├── template.blend         # Default template
├── music-visualizer.blend # Music-specific template
├── logo-animation.blend   # Logo animation template
└── custom-scene.blend     # User custom templates
```

### Configuration System
```typescript
interface BlenderConfig {
  defaultEngine: 'EEVEE' | 'CYCLES' | 'WORKBENCH';
  renderSettings: {
    samples: number;
    bounces: number;
    resolution: [number, number];
  };
  optimization: {
    enableGPU: boolean;
    tileSize: number;
    useDenoising: boolean;
  };
}
```

---

## Troubleshooting Técnico

### Common Error Codes
```
E001: Blender executable not found
E002: Template file missing  
E003: Invalid audio file format
E004: Render timeout (>30s)
E005: Insufficient disk space
E006: Python script syntax error
E007: Blender engine not supported
```

### Performance Optimization
```python
# Blender optimization script
bpy.context.scene.render.use_simplify = True
bpy.context.scene.render.simplify_subdivision = 2
bpy.context.scene.cycles.samples = 64  # Lower for preview
bpy.context.scene.cycles.use_denoising = True
```

### Memory Management
```typescript
// Cleanup after render
process.on('exit', () => {
  // Cleanup temporary files
  fs.rmSync(tempDir, { recursive: true, force: true });
});

// Blob URL cleanup (frontend)
useEffect(() => {
  return () => {
    if (previewImage?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);
```

---

**Versão**: V1.4.0.a.1  
**Última Atualização**: 16 de Julho de 2025  
**Status**: 99% funcional - Issue ativo: Image proxy loading
