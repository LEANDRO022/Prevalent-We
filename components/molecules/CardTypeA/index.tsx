import React, { useState } from 'react';

// Importacion de contextos
import { useIsMobile } from 'context/sidebar';

// Importacion de componentes
import Card from '@components/atoms/Card';
import Icon from '@components/atoms/Icon';
import Title from '@components/atoms/Title';
import Text from '@components/atoms/Text';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';

// Tipado props del componente
interface CardTypeAProps {
  iconCategory: string;
  iconName: string;
  title: string;
  category: string;
  lastUpdate: string;
}

function CardTypeA({
  lastUpdate,
  iconName,
  title,
  category,
  iconCategory,
}: CardTypeAProps) {
  // Implementacion de contexto
  const { isMobile } = useIsMobile();
  // Implementacion de estados
  const [activeFavourite, setActiveFavourite] = useState<boolean>(false);

  return (
    <Card extraClassNames={isMobile ? 'card_type_a__mobile' : ''}>
      <div className='card_type_a__mobile__container'>
        {/** */}
        <div className='col-span-2 flex gap-3'>
          <div className='card_type_a__box_icon'>
            <Icon
              iconCategory={iconCategory}
              iconName={iconName}
              extraclassName='card_type_a__icon'
            />
          </div>
          <div>
            <Title text={title} extraClassNames='card_type_a__title' />
            <Text text={category} extraClassNames='card_type_a__subtitle' />
          </div>
        </div>
        <div className='col-span-1 flex gap-4 justify-end'>
          <div className='block lg:hidden space-y-1'>
            <Text text='Last update:' extraClassNames='card_type_a__text' />
            <Text text={lastUpdate} extraClassNames='card_type_a__text' />
          </div>
          <div>
            <ButtonIcon
              type='button'
              iconCategory='ph'
              iconName={activeFavourite ? 'star-fill' : 'star-bold'}
              onClick={() => setActiveFavourite(!activeFavourite)}
              extraclassName='card_type_a__text'
            />
          </div>
        </div>
        {/** */}
        <div className='card_type_a__column_footer'>
          <Text text='Last update:' extraClassNames='card_type_a__text' />
          <Text text={lastUpdate} extraClassNames='card_type_a__text' />
        </div>
      </div>
    </Card>
  );
}

export default CardTypeA;
