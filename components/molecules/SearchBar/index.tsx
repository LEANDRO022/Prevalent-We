import React from 'react';

// Importacion de componentes customizados
import InputSearch from '@components/atoms/Inputs/InputSearch';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';

interface SearchBarProps {
  extraClassName?: string;
  searchValue?: string;
  onChange?: any;
  handleSearch?: any;
}

function SearchBar({
  extraClassName,
  searchValue,
  onChange,
  handleSearch,
}: SearchBarProps) {
  return (
    <div className='inline-flex'>
      <InputSearch
        name='searchDashboard'
        placeholder='Search'
        extraClassName={extraClassName}
        value={searchValue}
        onChange={onChange}
      />
      <div className='button_icon__color_search'>
        <ButtonIcon
          type='button'
          iconCategory='iconamoon'
          iconName='search-light'
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}

export default SearchBar;
