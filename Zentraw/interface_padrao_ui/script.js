import * as THREE from "https://esm.sh/three@0.175.0";
import { OrbitControls } from "https://esm.sh/three@0.175.0/examples/jsm/controls/OrbitControls.js";

document.addEventListener("DOMContentLoaded", function () {
  // GROK Configuration - Based on FASE 02 specifications
  const GROK_CONFIG = {
    WIDTH: 2560, // 2K default (configurable)
    HEIGHT: 1440, // 2K default (configurable)
    FPS: 30,
    DURATION_SECONDS: 240, // 4 minutes default
    PIXEL_RATIO: 1
  };

  // GROK Timeline Data Capture
  const timelineData = [];
  let frameCount = 0;
  let isCapturing = false;
  let startTime = 0;

  // Three.js Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 7);
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  document.getElementById('three-container').appendChild(renderer.domElement);

  // Audio System - GROK Compatible
  let audioContext = null;
  let audioAnalyser = null;
  let audioSource = null;
  let audioData = null;
  let frequencyData = null;
  let isAudioInitialized = false;
  let audioElement = null;

  function initAudio() {
    if (isAudioInitialized) return;
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 2048;
    audioAnalyser.smoothingTimeConstant = 0.8;
    
    audioData = new Uint8Array(audioAnalyser.frequencyBinCount);
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    
    isAudioInitialized = true;
    console.log("[GROK] Audio Analysis System Initialized");
  }

  function loadAudio(file) {
    initAudio();
    
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    
    audioElement = new Audio();
    audioElement.src = URL.createObjectURL(file);
    audioElement.crossOrigin = "anonymous";
    audioElement.loop = false;
    audioElement.preload = "auto";
    
    // Audio event listeners for debugging
    audioElement.addEventListener('loadstart', () => {
      console.log("[GROK] Audio loading started...");
      document.getElementById('audio-status').textContent = 'Loading...';
      document.getElementById('audio-status').className = 'status-indicator status-capturing';
    });
    
    audioElement.addEventListener('canplay', () => {
      console.log("[GROK] Audio can play");
      document.getElementById('audio-status').textContent = `Ready (${audioElement.duration.toFixed(1)}s)`;
      document.getElementById('audio-status').className = 'status-indicator status-complete';
    });
    
    audioElement.addEventListener('error', (e) => {
      console.error("[GROK] Audio error:", e);
      document.getElementById('audio-status').textContent = 'Audio error!';
      document.getElementById('audio-status').className = 'status-indicator status-ready';
    });
    
    // Connect to audio context after user interaction
    audioElement.addEventListener('loadeddata', () => {
      console.log(`[GROK] Audio loaded: ${audioElement.duration.toFixed(2)}s`);
      
      try {
        if (audioSource) {
          audioSource.disconnect();
        }
        
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
        
        // Enable controls
        document.getElementById('capture-btn').disabled = false;
        document.getElementById('preview-btn').disabled = false;
        document.getElementById('capture-status').textContent = 'Ready to capture';
        document.getElementById('preview-status').textContent = 'Ready to preview';
        
        console.log("[GROK] Audio connected to analyser successfully");
      } catch (error) {
        console.error("[GROK] Error connecting audio:", error);
        document.getElementById('audio-status').textContent = 'Connection error!';
      }
    });
    
    console.log("[GROK] Audio setup initiated");
  }

  // GROK Icosphere - Based on FASE 02 specifications
  const vertexShader = `
    uniform float uTime;
    uniform float uAudioAmplitude;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // Simplex noise function (from GROK pipeline)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vNormal = normal;
      vUv = uv;
      vec3 pos = position;
      
      // Audio-reactive displacement
      float noise = snoise(pos + uTime * 0.1) * uAudioAmplitude * 0.2;
      pos += normal * noise;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uAudioAmplitude;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      // Enhanced fresnel effect
      vec3 viewDirection = normalize(cameraPosition - gl_FragCoord.xyz);
      float fresnel = dot(normalize(vNormal), viewDirection);
      fresnel = pow(1.0 - fresnel, 2.0);
      
      // GROK enhanced color scheme with more variations
      vec3 primaryColor = vec3(1.0, 0.3, 0.2);  // #ff4e42
      vec3 secondaryColor = vec3(0.76, 0.21, 0.18); // #c2362f
      vec3 accentColor = vec3(1.0, 0.42, 0.26);  // #ff6b42
      
      // Mix colors based on fresnel and audio
      vec3 baseColor = mix(primaryColor, secondaryColor, fresnel);
      vec3 finalColor = mix(baseColor, accentColor, uAudioAmplitude * 0.7);
      
      // Add audio-reactive glow
      finalColor += vec3(uAudioAmplitude * 0.8);
      
      // Enhanced transparency with audio reactivity
      float alpha = 0.7 + uAudioAmplitude * 0.3 + fresnel * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const uniforms = {
    uTime: { value: 0.0 },
    uAudioAmplitude: { value: 0.0 }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    side: THREE.DoubleSide
  });

  // Create Icosphere with enhanced materials
  const geometry = new THREE.IcosahedronGeometry(2, 4); // Higher subdivision for smoother surface
  const icosphere = new THREE.Mesh(geometry, material);
  scene.add(icosphere);

  // GROK Enhanced Particle System
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2000; // More particles for richness
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // More organic distribution
    const radius = Math.random() * 15 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Enhanced GROK color variations
    const colorVariation = Math.random();
    let color;
    if (colorVariation < 0.4) {
      color = new THREE.Color(0xff4e42); // Primary GROK red
    } else if (colorVariation < 0.7) {
      color = new THREE.Color(0xc2362f); // Secondary GROK red
    } else if (colorVariation < 0.9) {
      color = new THREE.Color(0xff6b42); // Orange variant
    } else {
      color = new THREE.Color(0xffffff); // White highlights
    }
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Variable particle sizes
    sizes[i] = Math.random() * 3 + 0.5;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Enhanced particle material with size attenuation
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // GROK Enhanced Lighting Setup
  const pointLight1 = new THREE.PointLight(0xff4e42, 150, 200);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xc2362f, 150, 200);
  pointLight2.position.set(-5, -5, -5);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xff6b42, 100, 150);
  pointLight3.position.set(0, 8, 0);
  scene.add(pointLight3);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(2, 2, 2);
  scene.add(directionalLight);

  // Add ambient light for better visibility
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  // GROK Enhanced Environment
  scene.fog = new THREE.Fog(0x0a0a0a, 5, 25); // Darker, more dramatic fog

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // GROK Data Capture Functions
  function startPreview() {
    if (!audioElement) {
      alert("Please load an audio file first!");
      return;
    }

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log("[GROK] AudioContext resumed");
      });
    }

    // Start audio playback
    audioElement.currentTime = 0;
    audioElement.play().then(() => {
      console.log("[GROK] Audio preview started");
      document.getElementById('preview-status').textContent = 'Playing preview...';
      document.getElementById('preview-status').className = 'status-indicator status-capturing';
      document.getElementById('preview-btn').textContent = '⏹️ STOP PREVIEW';
    }).catch(error => {
      console.error("[GROK] Audio play error:", error);
      document.getElementById('preview-status').textContent = 'Play error!';
    });
  }

  function stopPreview() {
    if (audioElement) {
      audioElement.pause();
      console.log("[GROK] Audio preview stopped");
      document.getElementById('preview-status').textContent = 'Preview stopped';
      document.getElementById('preview-status').className = 'status-indicator status-ready';
      document.getElementById('preview-btn').textContent = '▶️ START PREVIEW';
    }
  }

  function startCapture() {
    if (!audioElement) {
      alert("Please load an audio file first!");
      return;
    }

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log("[GROK] AudioContext resumed for capture");
      });
    }

    timelineData.length = 0; // Clear previous data
    frameCount = 0;
    isCapturing = true;
    startTime = performance.now();

    // Update UI
    document.getElementById('capture-btn').textContent = '⏹️ STOP CAPTURE';
    document.getElementById('capture-status').textContent = 'Capturing...';
    document.getElementById('capture-status').className = 'status-indicator status-capturing capturing';

    // Start audio
    audioElement.currentTime = 0;
    audioElement.play().then(() => {
      console.log("[GROK] Timeline capture started");
    }).catch(error => {
      console.error("[GROK] Audio play error during capture:", error);
      stopCapture();
    });
  }

  function stopCapture() {
    isCapturing = false;
    
    if (audioElement) {
      audioElement.pause();
    }

    // Update UI
    document.getElementById('capture-btn').textContent = '📊 CAPTURE TIMELINE';
    document.getElementById('capture-status').textContent = `Captured ${frameCount} frames`;
    document.getElementById('capture-status').className = 'status-indicator status-complete';
    
    // Enable download
    document.getElementById('download-btn').disabled = false;
    document.getElementById('download-status').textContent = 'Ready to download';

    console.log(`[GROK] Timeline capture complete: ${frameCount} frames`);
  }

  function downloadTimeline() {
    if (timelineData.length === 0) {
      alert("No timeline data to download!");
      return;
    }

    const dataWithMetadata = {
      grok_version: "FASE_02",
      template_type: "gsap_threejs_inertia",
      config: GROK_CONFIG,
      total_frames: frameCount,
      duration_seconds: GROK_CONFIG.DURATION_SECONDS,
      capture_timestamp: new Date().toISOString(),
      timeline: timelineData
    };

    const blob = new Blob([JSON.stringify(dataWithMetadata, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grok-timeline.json';
    a.click();
    URL.revokeObjectURL(url);

    console.log("[GROK] Timeline JSON downloaded");
  }

  // Event Listeners
  document.getElementById('audio-input').addEventListener('change', (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      console.log(`[GROK] Loading audio file: ${file.name} (${(file.size/1024/1024).toFixed(2)}MB)`);
      loadAudio(file);
    }
  });

  document.getElementById('resolution-select').addEventListener('change', (e) => {
    const [width, height] = e.target.value.split('x').map(Number);
    GROK_CONFIG.WIDTH = width;
    GROK_CONFIG.HEIGHT = height;
    console.log(`[GROK] Resolution updated: ${width}x${height}`);
  });

  document.getElementById('duration-input').addEventListener('change', (e) => {
    GROK_CONFIG.DURATION_SECONDS = parseInt(e.target.value);
    console.log(`[GROK] Duration updated: ${GROK_CONFIG.DURATION_SECONDS}s`);
  });

  document.getElementById('preview-btn').addEventListener('click', () => {
    if (audioElement && !audioElement.paused) {
      stopPreview();
    } else {
      startPreview();
    }
  });

  document.getElementById('capture-btn').addEventListener('click', () => {
    if (isCapturing) {
      stopCapture();
    } else {
      startCapture();
    }
  });

  document.getElementById('download-btn').addEventListener('click', downloadTimeline);

  // GROK Animation Loop
  function animate(time) {
    requestAnimationFrame(animate);
    
    uniforms.uTime.value = time * 0.001;

    // Audio Analysis
    if (audioAnalyser && audioData && isAudioInitialized) {
      audioAnalyser.getByteFrequencyData(audioData);
      const avgAmplitude = audioData.reduce((a, b) => a + b, 0) / audioData.length / 255;
      
      // Update audio level indicator
      const audioLevelElement = document.getElementById('audio-level');
      if (audioLevelElement) {
        audioLevelElement.style.width = (avgAmplitude * 100) + '%';
      }
      
      // Update visual parameters with enhanced reactivity
      uniforms.uAudioAmplitude.value = avgAmplitude;
      
      // Enhanced icosphere animation
      const scaleMultiplier = 1 + avgAmplitude * 0.8; // More dramatic scaling
      icosphere.scale.setScalar(scaleMultiplier);
      icosphere.rotation.y += 0.008 * (1 + avgAmplitude * 2);
      icosphere.rotation.z += 0.003 * (1 + avgAmplitude * 1.5);
      icosphere.rotation.x += 0.001 * (1 + avgAmplitude);
      
      // Enhanced particle animation
      const baseSize = 0.1;
      const sizeMultiplier = baseSize + avgAmplitude * 0.3;
      particleMaterial.size = sizeMultiplier;
      
      // Animate particle positions slightly
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 0.001 + positions[i] * 0.01) * avgAmplitude * 0.02;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Enhanced lighting reactivity
      pointLight1.intensity = 150 + avgAmplitude * 200;
      pointLight2.intensity = 150 + avgAmplitude * 200;
      pointLight3.intensity = 100 + avgAmplitude * 150;

      // GROK Data Capture - CRITICAL SECTION
      if (isCapturing && frameCount < GROK_CONFIG.DURATION_SECONDS * GROK_CONFIG.FPS) {
        const currentTime = (performance.now() - startTime) / 1000;
        
        // Capture frame data for GROK pipeline
        timelineData.push({
          frame: frameCount + 1,
          time: currentTime,
          amplitude: avgAmplitude,
          rotation_y: icosphere.rotation.y,
          rotation_z: icosphere.rotation.z,
          scale: icosphere.scale.x,
          particle_size: particleMaterial.size,
          camera_position: {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
          },
          // Additional GROK parameters
          frequency_peak: Math.max(...audioData) / 255,
          light_intensity: avgAmplitude * 2,
          shader_time: uniforms.uTime.value
        });
        
        frameCount++;
        
        // Update progress
        const progress = (frameCount / (GROK_CONFIG.DURATION_SECONDS * GROK_CONFIG.FPS)) * 100;
        document.getElementById('capture-status').textContent = `Capturing... ${progress.toFixed(1)}%`;
        
        // Auto-stop when duration reached
        if (frameCount >= GROK_CONFIG.DURATION_SECONDS * GROK_CONFIG.FPS) {
          stopCapture();
        }
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Start animation
  animate(0);

  // Responsive
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log("[GROK] FASE 02 Preview System Initialized");
});
