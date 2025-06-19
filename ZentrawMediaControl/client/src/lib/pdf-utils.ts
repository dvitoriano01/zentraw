// PDF export utility using html2pdf.js
// Note: html2pdf.js will be loaded via CDN in the HTML file

declare global {
  interface Window {
    html2pdf: any;
  }
}

export function exportToPDF(content: string, filename: string): void {
  if (typeof window === 'undefined') {
    console.error('Not in browser environment');
    return;
  }
  
  if (!window.html2pdf) {
    console.error('html2pdf.js is not loaded');
    alert('PDF export library is still loading. Please try again in a moment.');
    return;
  }

  // Create a temporary element with the content
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      ${content}
    </div>
  `;
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '0';
  
  document.body.appendChild(element);

  const options = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  window.html2pdf()
    .set(options)
    .from(element)
    .save()
    .then(() => {
      // Clean up the temporary element
      document.body.removeChild(element);
    })
    .catch((error: any) => {
      console.error('PDF export failed:', error);
      document.body.removeChild(element);
    });
}
