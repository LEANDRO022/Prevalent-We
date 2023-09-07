import React from 'react';

// Props tipadas del componente
interface ButtonIconProps {
  type: 'button' | 'submit';
  onClick?: () => void;
  iconCategory: string;
  iconName: string;
  extraclassName?: string;
}

function ButtonIcon({
  type = 'button',
  onClick,
  iconCategory,
  iconName,
  extraclassName,
}: ButtonIconProps) {
  return (
    <button type={type === 'button' ? 'button' : 'submit'} onClick={onClick}>
      <i
        className={`iconify-inline w-6 h-6 text-white ${extraclassName}`}
        data-icon={`${iconCategory}:${iconName}`}
      />
    </button>
  );
}

export default ButtonIcon;
