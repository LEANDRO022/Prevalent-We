import React from 'react';

// Importacion de utilidades
import { dataShortcutsButtons } from 'utils/generalConst';

// Importacion de componentes customizados
import MenuContextual from '@components/atoms/Menu';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';
import Link from 'next/link';

// Props tipadas del componente
interface ShortcutMobileMenuProps {
  openShortcutMobileMenu: boolean;
  setOpenShortcutMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShortcutMobileMenu({
  openShortcutMobileMenu,
  setOpenShortcutMobileMenu,
}: ShortcutMobileMenuProps) {
  return (
    <MenuContextual
      open={openShortcutMobileMenu}
      setOpen={setOpenShortcutMobileMenu}
    >
      {/** Contenedor principal */}
      <div className='shortcut_mobile_menu'>
        {dataShortcutsButtons?.map(item => (
          // General link
          <Link href={item?.path} key={item?.id}>
            <div className='shortcut_mobile_menu__container'>
              <Icon
                iconCategory={item?.iconCategory}
                iconName={item?.iconName}
                extraclassName='shortcut_mobile_menu__icon'
              />
              <Text
                text={item?.title}
                extraClassNames='shortcut_mobile_menu__text'
              />
            </div>
          </Link>
        ))}
      </div>
    </MenuContextual>
  );
}

export default ShortcutMobileMenu;
