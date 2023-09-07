import React from 'react';

// Importacion de utilidades
import { dataCardRecents } from 'utils/generalConst';

// Importacion de contextos
import { useIsMobile } from 'context/sidebar';

// Importacion de componentes customizados
import Text from '@components/atoms/Text';
import CardTypeA from '@components/molecules/CardTypeA';

function Recents() {
  // Implementacion de contexto
  const { isMobile } = useIsMobile();
  return (
    <div className='animate-slide-bottom'>
      {/** Encabezado */}
      <div className={isMobile ? 'block' : 'hidden'}>
        <Text
          text='There are currently two recently opened items'
          extraClassNames='recent__text'
        />
      </div>
      {/** Renderizado de informacion -- Cards */}
      <div className='recent_container__main'>
        {dataCardRecents?.map(item => (
          <div key={item?.id}>
            <CardTypeA
              iconCategory={item?.iconCategory}
              iconName={item?.iconName}
              title={item?.title}
              category={item?.category}
              lastUpdate={item?.lastUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recents;
