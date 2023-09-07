import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Importacion de componentes customizados
import Text from '@components/atoms/Text';
import Icon from '@components/atoms/Icon';

// Props tipadas del componenete
interface ProgressCircleProps {
  color: string;
  background: string;
  label: string;
  percentage: number;
  value: string;
}

function ProgressCircle({
  color,
  label,
  background,
  percentage,
  value,
}: ProgressCircleProps) {
  return (
    <div className='progress_circle'>
      <div className='flex flex-col gap-5 justify-center items-center'>
        <div className='container__label'>
          <Icon
            iconCategory='ph'
            iconName='circle-fill'
            extraclassName={`progress_circle__icon ${color}`}
          />
          <Text text={label} extraClassNames='progress_circle__text' />
        </div>
        <div
          style={{
            width: 110,
            height: 100,
          }}
        >
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            background
            styles={{
              background: {
                fill: `${background}`,
              },
              trail: {
                // Trail color
                stroke: 'transparent',
              },
              path: {
                // Path color
                stroke: `${color}`,
              },
              text: {
                // Text color
                fill: '#27394F',
                // Text size
                fontSize: '14px',
                fontFamily: 'font-primary-regular',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
        <div className='container__label_porcentage'>
          <Text text={`$ ${value}`} extraClassNames='progress_circle__text' />
        </div>
      </div>
    </div>
  );
}

export default ProgressCircle;
