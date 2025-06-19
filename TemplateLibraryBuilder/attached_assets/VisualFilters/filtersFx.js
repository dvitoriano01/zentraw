const filters = {
  none: 'none',
  lofi: 'contrast(1.4) saturate(1.6)',
  clarendon: 'brightness(1.2) contrast(1.1) saturate(1.2)',
  vhs: 'contrast(1.5) saturate(1.2) hue-rotate(-15deg)',
  prisma: 'contrast(1.4) saturate(1.4) sepia(0.3)',
  tumblr: 'saturate(1.3) hue-rotate(10deg) brightness(1.1)',
  pretoebranco: 'grayscale(1)',
  luz: 'brightness(1.3) contrast(1.1)',
};

document.getElementById('filterSelector').addEventListener('change', function() {
  const selectedFilter = filters[this.value] || 'none';
  document.getElementById('previewImage').style.filter = selectedFilter;
});
