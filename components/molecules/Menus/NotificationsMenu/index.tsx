import React from 'react';
import Link from 'next/link';

// Importacion de utilidades
import { itemsNotifications } from 'utils/generalConst';

// Importacion de componenetes customizados
import MenuContextual from '@components/atoms/Menu';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';
import Notification from '@components/molecules/Notification';

// Props tipadas del componente
interface NotificationsMenuProps {
  openNotificationsMenu: boolean;
  setOpenNotificationsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function NotificationsMenu({
  openNotificationsMenu,
  setOpenNotificationsMenu,
}: NotificationsMenuProps) {
  return (
    <MenuContextual
      open={openNotificationsMenu}
      setOpen={setOpenNotificationsMenu}
    >
      {/** Contenedor principal */}
      <div className='notification_menu'>
        {/** Seccion de encabezado */}
        <div className='notification_menu__head'>
          {/** Columna 1 */}
          <div className='flex gap-x-2 items-center'>
            <Icon
              iconCategory='ph'
              iconName='bell'
              extraclassName='notification_menu__icon'
            />
            <Text
              text='Notifications'
              extraClassNames='notification_menu__text'
            />
          </div>
          {/** Columna 2 */}
          <div className='flex justify-end'>
            <button type='button' className='flex gap-x-2 items-center'>
              <Text
                text='Mark all as read'
                extraClassNames='notification_menu__text'
              />
              <Icon
                iconCategory='ph'
                iconName='check-circle-light'
                extraclassName='notification_menu__icon'
              />
            </button>
          </div>
        </div>
        {/** Listado de notificaciones --lista ordenada */}
        <div className='notification_menu__main'>
          <ul>
            {itemsNotifications?.map(notification => (
              <li key={notification?.id} className='mb-2'>
                <Link href='/'>
                  <Notification
                    user={notification?.user}
                    description={notification?.description}
                    lastUpdate={notification?.lastUpdate}
                    time={notification?.time}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MenuContextual>
  );
}

export default NotificationsMenu;
