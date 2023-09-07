import React, { useState } from 'react';

// Importacion de uso del contexto
import { useIsMobile } from 'context/sidebar';

// Importacion de componentes customizados
import Breadcrumbs from '@components/molecules/Breadcrumb';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import SearchBar from '@components/molecules/SearchBar';
import Dropdown from '@components/molecules/Dropdown';
import Avatar from '@components/atoms/Avatar';
import AccountMenu from '@components/molecules/Menus/AccountMenu';
import NotificationsMenu from '@components/molecules/Menus/NotificationsMenu';
import RecentsMenu from '@components/molecules/Menus/RecentsMenu';

function Navbar() {
  const { openSidebarMobile, setOpenSidebarMobile } = useIsMobile();
  const [openRecentsMenu, setOpenRecentsMenu] = useState<boolean>(false);
  const [openNotificationsMenu, setOpenNotificationsMenu] = useState<boolean>(
    false
  );
  const [openAccountMenu, setOpenAccountMenu] = useState<boolean>(false);

  return (
    <div className='navbar'>
      {/** Rejilla contenedora */}
      <div className='navbar__container'>
        {/** Columna 1 - Ruta dinamica */}
        <div className='hidden lg:block'>
          <Breadcrumbs />
        </div>
        {/** Columna 2 - componentes varios */}
        <div className='navbar__column'>
          <div className='navbar__column_input'>
            {/** menu hamburguesa */}
            <div className='lg:hidden'>
              <ButtonIcon
                type='button'
                iconCategory='ic'
                iconName='round-menu'
                extraclassName='nav__icon nav__icon_menu'
                onClick={() => setOpenSidebarMobile(!openSidebarMobile)}
              />
            </div>
            {/** input select */}
            <div className='w-full hidden lg:block'>
              <Dropdown
                iconCategory='gis'
                iconName='location-man'
                placeholder='Select sponsor'
                opts={[
                  {
                    value: 'P1',
                    label: 'Prevalentware 1',
                  },
                  {
                    value: 'P2',
                    label: 'Prevalentware 2',
                  },
                  {
                    value: 'P3',
                    label: 'Prevalentware 3',
                  },
                ]}
              />
            </div>
            {/** Barra de busqueda */}
            <div className='w-full'>
              <SearchBar />
            </div>
          </div>
          <div className='navbar__column_icon'>
            <ButtonIcon
              type='button'
              iconCategory='ic'
              iconName='round-restore'
              extraclassName='hidden lg:block nav__icon'
              onClick={() => setOpenRecentsMenu(!openRecentsMenu)}
            />

            <ButtonIcon
              type='button'
              iconCategory='ph'
              iconName='bell'
              extraclassName='nav__icon'
              onClick={() => setOpenNotificationsMenu(!openNotificationsMenu)}
            />

            <button
              type='button'
              onClick={() => setOpenAccountMenu(!openAccountMenu)}
            >
              <Avatar src='' alt='' />
            </button>

            {/** Menus contextual activado por estado */}
            <AccountMenu
              openAccountMenu={openAccountMenu}
              setOpenAccountMenu={setOpenAccountMenu}
            />
            <NotificationsMenu
              openNotificationsMenu={openNotificationsMenu}
              setOpenNotificationsMenu={setOpenNotificationsMenu}
            />
            <RecentsMenu
              openRecentsMenu={openRecentsMenu}
              setOpenRecentsMenu={setOpenRecentsMenu}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
