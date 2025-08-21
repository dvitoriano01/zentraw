const testPreview = async () => {
  try {
    console.log('🔍 Testing preview generation...');
    
    // Simular um FormData com arquivos
    const formData = new FormData();
    
    // Usar arquivos existentes do uploads
    const audioBlob = new Blob(['test audio'], { type: 'audio/wav' });
    const imageBlob = new Blob(['test image'], { type: 'image/png' });
    
    formData.append('audio', audioBlob, 'test.wav');
    formData.append('image', imageBlob, 'test.png');
    formData.append('renderEngine', 'eevee');
    formData.append('cameraDistance', '10');
    formData.append('cameraHeight', '5');
    formData.append('cameraAngle', '45');
    formData.append('animationStyle', 'cube');
    formData.append('sensitivity', '50');
    formData.append('smoothing', '30');
    
    const response = await fetch('http://localhost:5001/api/blender/preview', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('📊 Preview result:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testPreview();
