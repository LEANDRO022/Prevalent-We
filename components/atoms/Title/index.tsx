import React from 'react';

// Props tipadas del componente
interface TextProps {
  text: string;
  extraClassNames?: string;
}

function Title({ text, extraClassNames }: TextProps) {
  return (
    <div>
      <h1 className={`text-white ${extraClassNames}`}>{text}</h1>
    </div>
  );
}

export default Title;
