import React from 'react';
import Link from 'next/link';

// Importacion de utilidades
import { itemsMenuFooterTab } from 'utils/generalConst';

// Importacion de componentes customizados
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';

function FooterTab() {
  return (
    <div className='bg-black border-colorCyan h-24 border-t-2 animate-slide-bottom'>
      <ul className='w-full flex items-center justify-around mx-2'>
        {itemsMenuFooterTab?.map(item => (
          <Link href={item?.path} key={item?.id}>
            <li className='my-4 flex flex-col items-center'>
              <Icon
                iconCategory={item?.iconCategory}
                iconName={item?.iconName}
                extraclassName='text-white'
              />
              <Text text={item?.title} extraClassNames='text-white' />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default FooterTab;
