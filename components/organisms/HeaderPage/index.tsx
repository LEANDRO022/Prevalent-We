import React from 'react';
import Link from 'next/link';

// Importacion de componentes customizados
import Title from '@components/atoms/Title';
import Text from '@components/atoms/Text';
import SearchBar from '@components/molecules/SearchBar';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';

// Props del componente tipado
interface HeaderPageProps {
  titleMaster: string;
  countMaster?: number;
  master: string;
  children?: React.ReactNode;
  linkMaster: string;
}

function HeaderPage({
  titleMaster,
  countMaster,
  master,
  children,
  linkMaster,
}: HeaderPageProps) {
  // const [inputValue, setInputValue] = useState('');

  return (
    <div className='header_page'>
      {/** Textos de encabezado */}
      <div className='header_page__head'>
        <Title text={titleMaster} extraClassNames='header_page__title' />
        <Text
          text={`${countMaster} ${master}`}
          extraClassNames='header_page__text'
        />
      </div>
      {/** Acciones(busqueda, botones) */}
      <div className='order-1 lg:order-2 flex justify-between gap-x-5'>
        <div className='w-full flex flex-row'>
          <SearchBar
          // name=''
          // placeholder='Search'
          // onChange={e => {
          //   setInputValue(e.target.value);
          // }}
          />
          <div className='header_page__button'>
            <ButtonIcon
              type='button'
              iconCategory='material-symbols'
              iconName='search'
              onClick={() => {
                // setUserSearch(inputValue);
              }}
            />
          </div>
        </div>
        {/** Botones de accion */}
        <div className='flex gap-x-5'>
          <div>{children}</div>
          <div className='button_icon__color'>
            <Link href={linkMaster}>
              <ButtonIcon
                type='button'
                iconCategory='ph'
                iconName='plus-bold'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderPage;
