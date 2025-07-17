// FontPreview.tsx - Componente para prévia de fontes
import React from 'react';

interface FontPreviewProps {
  fontFamily: string;
  text?: string;
  size?: number;
  className?: string;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  fontFamily,
  text = 'Abc 123',
  size = 14,
  className = '',
}) => {
  return (
    <span
      className={`font-preview ${className}`}
      style={{
        fontFamily: fontFamily,
        fontSize: `${size}px`,
        lineHeight: 1.2,
      }}
    >
      {text}
    </span>
  );
};

export default FontPreview;
