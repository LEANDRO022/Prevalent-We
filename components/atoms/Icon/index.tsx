import React from 'react';

// Props tipadas del componente
interface IconProps {
  iconCategory: string;
  iconName: string;
  extraclassName?: string;
}

function Icon({ iconCategory, iconName, extraclassName }: IconProps) {
  return (
    <div>
      <i
        className={`iconify-inline w-5 h-5 text-white ${extraclassName}`}
        data-icon={`${iconCategory}:${iconName}`}
      />
    </div>
  );
}

export default Icon;
