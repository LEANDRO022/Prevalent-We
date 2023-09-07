import React, { useState, useEffect, SetStateAction } from 'react';
import Link from 'next/link';

// Importacion de utilidades
import { itemsMenuSidebarMobile } from 'utils/generalConst';

// Importacion de contextos
import { useIsMobile } from 'context/sidebar';

// Importacion de componentes customizados
import Dropdown from '@components/molecules/Dropdown';
import Imagen from '@components/atoms/Imagen';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';

// Props tidadasdel componente
interface SidebarMobileProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

function SidebarMobile({ open, setOpen }: SidebarMobileProps) {
  // Implementacion de contexto
  const { openSidebarMobile } = useIsMobile();
  const [isClickCaptureClose, setIsClickCaptureClose] = useState<boolean>(
    false
  );

  const onClickCaptureClose = () => {
    setIsClickCaptureClose(true);
  };

  const onClickCaptureOpen = () => {
    setIsClickCaptureClose(false);
  };

  useEffect(() => {
    if (isClickCaptureClose) {
      setOpen(false);
      onClickCaptureOpen();
    }
  }, [isClickCaptureClose]);

  return (
    <div
      className={`sidebarMobile ${openSidebarMobile ? 'block' : 'hidden'}`}
      onClickCapture={onClickCaptureClose}
    >
      {/** Contenedor principal  */}
      {open && (
        <div className='sidebarMobile__container'>
          {/** input select */}
          <div className='w-full' onClickCapture={onClickCaptureOpen}>
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
          {/** Menu -- lista ordenada  */}
          <div className='menu'>
            {/** Contenedor imagen */}
            <div className='menu__container_image'>
              <Imagen src='/img/logos/favicon.ico' alt='Imagen Logotipo' />
            </div>
            {/** Menu */}
            <div className='space-y-20'>
              {/** Contenedor lista ---links de acceso */}
              <div>
                <ul>
                  {itemsMenuSidebarMobile?.map(item => (
                    <Link href={item?.path} key={item?.id}>
                      <li className='my-4 flex h-10 items-center gap-x-3'>
                        <span className='flex items-center justify-center p-2'>
                          <Icon
                            iconCategory={item?.iconCategory}
                            iconName={item?.iconName}
                            extraclassName='sidebarMobile__icon'
                          />
                        </span>
                        <span>
                          <Text
                            text={item?.title}
                            extraClassNames='sidebarMobile__text'
                          />
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
              {/** Contenedor lista ---botones de accion */}
              <div>
                <ul>
                  <Link href='/'>
                    <li className='my-4 flex h-10 items-center gap-x-3'>
                      <span className='flex items-center justify-center p-2'>
                        <Icon
                          iconCategory='material-symbols'
                          iconName='help-outline'
                          extraclassName='sidebarMobile__icon'
                        />
                      </span>
                      <span>
                        <Text
                          text='Help'
                          extraClassNames='sidebarMobile__text'
                        />
                      </span>
                    </li>
                  </Link>
                  <li className='my-4 flex h-10 items-center gap-x-3'>
                    <span className='flex items-center justify-center p-2'>
                      <Icon
                        iconCategory='ph'
                        iconName='gear'
                        extraclassName='sidebarMobile__icon'
                      />
                    </span>
                    <span>
                      <Text
                        text='Settings'
                        extraClassNames='sidebarMobile__text'
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarMobile;
