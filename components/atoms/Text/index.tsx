import React from 'react';

// Props tipadas del componente
interface TextProps {
  text: string;
  extraClassNames?: string;
}

function Text({ text, extraClassNames }: TextProps) {
  return (
    <div>
      <p className={`text-white ${extraClassNames}`}>{text}</p>
    </div>
  );
}

export default Text;
