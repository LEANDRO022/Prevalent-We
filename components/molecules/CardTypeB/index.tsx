import React from 'react';

// Importacion de uso del contexto
import { useIsMobile } from 'context/sidebar';

// Importacion de componentes customizados
import Card from '@components/atoms/Card';
import Icon from '@components/atoms/Icon';
import Title from '@components/atoms/Title';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Badge from '@components/atoms/Badge';
import Text from '@components/atoms/Text';
import ProgressBar from '@components/atoms/Gauge/ProgressBar';
import Avatar from '@components/atoms/Avatar';

// Tipado de props del componente
interface CardTypeBProps {
  iconCategory?: string;
  iconName?: string;
  projectName: string;
  state: string;
  stateColor: string;
  category: string;
  protocolId: string;
  description: string;
  studyGlobalProgress: string;
  subjects: number;
  sites: number;
  users: string[];
  lastUpdate: string;
}

function CardTypeB({
  iconCategory,
  iconName,
  projectName,
  state,
  stateColor,
  category,
  protocolId,
  description,
  studyGlobalProgress,
  subjects,
  sites,
  users,
  lastUpdate,
}: CardTypeBProps) {
  const { isMobile } = useIsMobile();

  return (
    <Card extraClassNames='card_type'>
      {/** Container #1 */}
      <div className='card_type__container_head'>
        {/** Detalle proyecto */}
        <div className='container_head__text'>
          <Icon
            iconCategory={iconCategory}
            iconName={iconName}
            extraclassName='card_type_b__icon'
          />
          <Title text={projectName} extraClassNames='card__title' />
        </div>
        {/** Botton de accion */}
        <div className='container_head__button'>
          <Badge text={state} color={stateColor} />
          <ButtonIcon
            type='button'
            iconCategory='ph'
            iconName='star-fill'
            extraclassName='card__icon'
          />
        </div>
      </div>
      {/** Container #2 */}
      <div className='card_type__container_main'>
        {/** Textos */}
        <div className='container_main__text'>
          <Text text={category} extraClassNames='card__subtitle' />
          <Text text={protocolId} extraClassNames='card__text' />
          <Text
            text={description?.substring(0, 100)}
            extraClassNames='card__text card_type_b__text'
          />
        </div>
        {/** Indicadores */}
        <div className='container_main__indicator'>
          {/** Barra de carga */}
          <div>
            <Text
              text='Study global progress'
              extraClassNames='card__text card__text_progressbar'
            />
            <div className='card_type_b__progressbar'>
              <ProgressBar percentage={studyGlobalProgress} />
              <Text
                text={`${studyGlobalProgress}%`}
                extraClassNames='card__text card__text_progressbar'
              />
            </div>
          </div>
          {/** Porcentaajes */}
          <div className='container_main__info'>
            <Text
              text={`Subjects: ${subjects}`}
              extraClassNames={isMobile ? 'card__text_badge' : 'card__text'}
            />
            <Text
              text={`Sites: ${sites}`}
              extraClassNames={isMobile ? 'card__text_badge' : 'card__text'}
            />
          </div>
        </div>
        {/** */}
        <hr />
        {/** Avatars */}
        <div className='container_main__footer'>
          <div className='container_main__avatar'>
            {users?.map(user => (
              <div key={user}>
                <Avatar
                  src=''
                  alt='Avatars'
                  extraClassName='card_type__avatar'
                />
              </div>
            ))}
          </div>
          <div className='container_main__date'>
            <Text
              text={`Last update: ${lastUpdate}`}
              extraClassNames='card__text'
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CardTypeB;
