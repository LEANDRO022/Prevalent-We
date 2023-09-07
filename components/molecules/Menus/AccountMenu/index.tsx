import React from 'react';
import Link from 'next/link';

// Importacion de componenetes customizados
import MenuContextual from '@components/atoms/Menu';
import Avatar from '@components/atoms/Avatar';
import Text from '@components/atoms/Text';

// Props tipadas del componente
interface AccountMenuProps {
  openAccountMenu: boolean;
  setOpenAccountMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function AccountMenu({
  openAccountMenu,
  setOpenAccountMenu,
}: AccountMenuProps) {
  return (
    <MenuContextual open={openAccountMenu} setOpen={setOpenAccountMenu}>
      {/** Contenedor principal */}
      <div className='account_menu'>
        {/** Seccion de encabezado */}
        <div className='flex gap-x-3'>
          <Avatar src='' alt='' />
          <div>
            <Text text='John chavarro' extraClassNames='account_menu__text' />
            <Text text='Role' extraClassNames='account_menu__text_subtitle' />
          </div>
        </div>
        {/** Seccion de opciones --lista ordenada */}
        <div>
          <ul>
            <li>
              <Link href='/'>
                <Text
                  text='Privacy Policy'
                  extraClassNames='account_menu__text_link'
                />
              </Link>
            </li>
            <li>
              <Link href='/'>
                <Text
                  text='Account settings'
                  extraClassNames='account_menu__text_link'
                />
              </Link>
            </li>
            <li>
              <button type='button'>
                <Text
                  text='Log Out'
                  extraClassNames='account_menu__text_link'
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </MenuContextual>
  );
}

export default AccountMenu;
