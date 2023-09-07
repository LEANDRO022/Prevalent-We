import React from 'react';

// Importacion de componentes customizados
import Icon from '@components/atoms/Icon';
import Title from '@components/atoms/Title';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';

// Props tipadas del componente
interface WidgetProps {
  iconCategory: string;
  iconName: string;
  text: string;
  activeButtonIcon?: boolean;
  iconCategoryButton?: string;
  iconNameButton?: string;
  onClick?: () => {};
  children?: React.ReactNode;
}

function Widget({
  iconCategory,
  iconName,
  text,
  activeButtonIcon,
  iconCategoryButton,
  iconNameButton,
  onClick,
  children,
}: WidgetProps) {
  return (
    <div className='widget'>
      {/** Cinta encabezado */}
      <div className='widget__header'>
        {/** */}
        <div className='widget__header_container'>
          <Icon iconCategory={iconCategory} iconName={iconName} />
          <Title text={text} extraClassNames='widget__title' />
        </div>
        {/** Opcion de botton de accion */}
        <div className={activeButtonIcon ? 'block' : 'hidden'}>
          <ButtonIcon
            type='button'
            iconCategory={iconCategoryButton ?? ''}
            iconName={iconNameButton ?? ''}
            onClick={onClick}
            extraclassName='widget__button_action'
          />
        </div>
      </div>
      {/** Contenido */}
      <div className='p-5'>{children}</div>
    </div>
  );
}

export default Widget;
