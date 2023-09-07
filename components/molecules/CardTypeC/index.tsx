import React from 'react';

// Importacion de componentes custimizados
import Card from '@components/atoms/Card';
import Title from '@components/atoms/Title';
import Text from '@components/atoms/Text';
import Badge from '@components/atoms/Badge';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Avatar from '@components/atoms/Avatar';
import ProgressBar from '@components/atoms/Gauge/ProgressBar';

// Props tipadas del componente
interface CardTypeCProps {
  projectName: string;
  state: string;
  stateColor: string;
  category: string;
  protocolId: string;
  studyGlobalProgress: string;
  subjects: number;
  sites: number;
  users: string[];
}

function CardTypeC({
  projectName,
  state,
  stateColor,
  category,
  protocolId,
  studyGlobalProgress,
  subjects,
  sites,
  users,
}: CardTypeCProps) {
  return (
    <Card>
      {/** Container #1 */}
      <div className='card_type__container_head'>
        {/** Detalle proyecto */}
        <Title text={projectName} extraClassNames='card__title' />
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
        <div className='container_main__text container_main__text_type_c'>
          <div>
            <Text text={category} extraClassNames='card__subtitle' />
            <Text text={protocolId} extraClassNames='card__text' />
          </div>
          <div>
            <Text
              text='03/20/2023'
              extraClassNames='card__text card__subtitle card_type_c__subtitle'
            />
          </div>
        </div>
        {/** Avatars */}
        <div className='container_main__footer'>
          <div className='container_main__footer_card_type_c'>
            <Text text='Collaborators:' extraClassNames='card__text' />
            <div className='container_main__avatar'>
              {users?.map(user => (
                <div key={user}>
                  <Avatar
                    src=''
                    alt='avatar'
                    extraClassName='card_type__avatar'
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='hidden lg:container_main__info'>
            <Text text={`Subjects: ${subjects}`} extraClassNames='card__text' />
            <Text text={`Sites: ${sites}`} extraClassNames='card__text' />
          </div>
        </div>
        {/** Barra de progreso */}
        <div className='container_main__card_type_c__progressbar'>
          <Text
            text='Study global progress'
            extraClassNames='card__text card__text_progressbar'
          />
          <Text
            text={`${studyGlobalProgress}%`}
            extraClassNames='card__text card__text_progressbar'
          />
        </div>
        <ProgressBar percentage={studyGlobalProgress} />
      </div>
    </Card>
  );
}

export default CardTypeC;
