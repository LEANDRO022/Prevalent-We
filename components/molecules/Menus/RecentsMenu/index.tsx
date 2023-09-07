import React from 'react';

// Importacion de componenetes customizados
import MenuContextual from '@components/atoms/Menu';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';

// Props tipadas del componente
interface RecentsMenuProps {
  openRecentsMenu: boolean;
  setOpenRecentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecentsMenu({
  openRecentsMenu,
  setOpenRecentsMenu,
}: RecentsMenuProps) {
  return (
    <MenuContextual open={openRecentsMenu} setOpen={setOpenRecentsMenu}>
      {/** Contenedor principal */}
      <div className='recents_menu'>
        {/** Seccion de encabezado */}
        <div className='recents_menu__head'>
          <div className='flex gap-x-2 items-center'>
            <Icon
              iconCategory='ic'
              iconName='round-restore'
              extraclassName='recents_menu__icon'
            />
            <Text text='Recents' extraClassNames='recents_menu__text' />
          </div>
        </div>
      </div>
    </MenuContextual>
  );
}

export default RecentsMenu;
