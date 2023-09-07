import React from 'react';

// Props tipadas del componente
interface BadgeProps {
  color?: string;
  text: string;
  extraClassName?: string;
}

function Badge({ color, text, extraClassName }: BadgeProps) {
  return (
    <div
      className={`text-center text-white px-3 py-1 rounded-sm text-xs capitalize ${extraClassName}`}
      style={{ backgroundColor: `${color}` }}
    >
      {text}
    </div>
  );
}

export default Badge;
