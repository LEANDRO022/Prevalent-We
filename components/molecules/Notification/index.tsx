import Avatar from '@components/atoms/Avatar';
import Text from '@components/atoms/Text';
import React from 'react';

// Props tipadas del componente
interface NotificationProps {
  user: string;
  description: string;
  lastUpdate: string;
  time: string;
}

function Notification({
  user,
  description,
  lastUpdate,
  time,
}: NotificationProps) {
  return (
    <div className='notification'>
      {/** Caja 1 */}
      <div>
        <Avatar src='' alt='' />
      </div>
      {/** Caja 2 */}
      <div className='notification__content'>
        <div className='notification__content_description'>
          <div className='col-span-1 overflow-hidden'>
            <Text text={user} extraClassNames='notification__text' />
          </div>
          <div className='col-span-2 overflow-hidden'>
            <Text
              text={description}
              extraClassNames='notification__text notification__text_thin'
            />
          </div>
        </div>
        <div>
          <Text
            text={`${lastUpdate} at ${time}`}
            extraClassNames='notification__text notification__text_thin notification__text_thingrey'
          />
        </div>
      </div>
    </div>
  );
}

export default Notification;
