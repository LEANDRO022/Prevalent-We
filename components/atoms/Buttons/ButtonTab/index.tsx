import React from 'react';

// Props tipadas del componente
interface ButtonTabProps {
  text: string;
  iconCategory?: string;
  iconName?: string;
  activeTab: boolean;
  extraclassName?: string;
  onClick?: () => void;
}

function ButtonTab({
  text,
  iconCategory,
  iconName,
  activeTab,
  extraclassName,
  onClick,
}: ButtonTabProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`border-b pl-2 pr-5 pb-2 ${
        activeTab ? 'border-b-2 border-b-colorCyan' : 'border-b-icon'
      }`}
    >
      <p
        className={`button_tab__text ${extraclassName} ${
          activeTab
            ? 'text-colorCyan font-fontPrimaryRegular font-bold'
            : 'text-icon font-fontPrimaryRegular text-black'
        }`}
      >
        {text}
      </p>
      <i
        className='iconify-inline w-5 h-5 text-colorCyan'
        data-icon={`${iconCategory}:${iconName}`}
      />
    </button>
  );
}

export default ButtonTab;
