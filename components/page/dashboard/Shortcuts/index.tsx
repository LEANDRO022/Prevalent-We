import React from 'react';
import Link from 'next/link';

// Importacion de utilidades
import { dataShortcutsButtons } from 'utils/generalConst';

import Text from '@components/atoms/Text';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';

function Shortcut() {
  return (
    <div className='shortcut'>
      {dataShortcutsButtons?.map(shortcut => (
        <div key={shortcut?.id} className='shortcut__container'>
          <Text text={shortcut?.title} extraClassNames='shortcut__text' />
          <Link href={shortcut?.path}>
            <ButtonIcon
              type='button'
              iconCategory={shortcut?.iconCategory}
              iconName={shortcut?.iconName}
              extraclassName='shortcut__button_icon'
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Shortcut;
