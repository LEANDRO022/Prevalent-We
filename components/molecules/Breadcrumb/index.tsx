import React from 'react';
import { useRouter } from 'next/router';

// Importacion de componentes customizados
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';

// Props tipados del componente
interface BreadcrumbsProps {
  extraClassName?: string;
}

function Breadcrumbs({ extraClassName }: BreadcrumbsProps) {
  const router = useRouter();
  const pathParts = router.asPath.split('/').filter(part => part !== '');

  return (
    <div className={`breadcrumbs ${extraClassName}`}>
      <ButtonIcon
        type='button'
        iconCategory='ph'
        iconName='caret-circle-left-fill'
        extraclassName='breadcrumb__icon_buttton'
        onClick={() => router.back()}
      />
      <Icon
        iconCategory='akar-icons'
        iconName='home'
        extraclassName='breadcrumb__icon'
      />
      <nav>
        <ul className='flex gap-x-3'>
          {pathParts.length > 0 && (
            <>
              <li>
                <li>
                  <Text
                    text={pathParts[0]}
                    extraClassNames='breadcrumb__link'
                  />
                </li>
              </li>
              {pathParts.length > 1 && (
                <li>
                  <Text text='/' extraClassNames='breadcrumb__divider' />
                </li>
              )}
            </>
          )}
          {pathParts.length > 1 && (
            <li>
              <Text
                text={pathParts[pathParts.length - 1]}
                extraClassNames='breadcrumb__link breadcrumb__link_current'
              />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Breadcrumbs;
