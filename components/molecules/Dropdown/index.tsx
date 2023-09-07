import React, { useMemo } from 'react';
import Select from 'react-select';

// Importacion de componentes customizados
import Icon from '@components/atoms/Icon';

// Props del componente tipado
interface InputSelectProps {
  text?: string;
  iconCategory?: string;
  iconName?: string;
  selectName?: string;
  placeholder?: string;
  defaultValue?: {};
  opts?: { value: any; label: string }[];
  setSelected?: React.Dispatch<React.SetStateAction<any>>;
  extraClassNames?: string;
  isMulti?: boolean;
  onFocus?: any;
  isClearable?: boolean;
  isDisabled?: boolean;
  required?: boolean;
}
function InputSelect({
  text,
  iconCategory,
  iconName,
  selectName,
  placeholder,
  defaultValue,
  opts,
  setSelected = () => {},
  extraClassNames,
  isMulti = false,
  onFocus,
  isClearable = false,
  isDisabled,
  required,
}: InputSelectProps) {
  const stylesSelect = useMemo(
    () => ({
      container: (styles: any) => ({
        ...styles,
        maxWidth: '30rem',
        width: '100%',
        fontFamily: 'font-primary-regular',
        fontSize: '14px',
      }),
      control: (styles: any) => ({
        ...styles,
        boxShadow: 'none',
        borderWidth: '0',
        height: '2rem',
        '&:hover': {}, // Establecer estilos vacíos para el hover
        '&:focus': {}, // Establecer estilos vacíos para el focus
      }),
      menuList: (styles: any) => ({
        ...styles,
        color: '#131313',
        fontFamily: 'font-primary-regular',
        fontSize: '14px',
      }),
      placeholder: (styles: any) => ({
        ...styles,
        color: '#667080',
        fontSize: '14px',
      }),
      // Color de icon
      dropdownIndicator: (styles: any) => ({
        ...styles,
        color: '#131313',
      }),
      indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
      menuPortal: (base: any) => ({ ...base, zIndex: 9999999 }),
    }),
    []
  );
  const themeSelect = (theme: any) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: '#26B693', // hover a items de la lista
      primary: '#9E9EA2', // Background de items list seleccionado
      primary50: '#C4C4C4', // Background de items al hacer clik
      danger: '#FF3636',
      dangerLight: '#FBFCFC',
    },
  });
  return (
    <div className={`dropdown__label ${extraClassNames}`}>
      <span>
        {text}
        {required && <span className='ml-1 font-bold text-colorCyan'> * </span>}
      </span>
      <div className='dropdown'>
        <div className='dropdown__container'>
          <Icon
            iconCategory={iconCategory}
            iconName={iconName}
            extraclassName='dropdown__icon'
          />
          <Select
            name={selectName}
            placeholder={placeholder}
            isMulti={isMulti}
            isClearable={isClearable}
            styles={stylesSelect}
            theme={themeSelect}
            maxMenuHeight={120}
            menuPlacement='auto'
            isDisabled={isDisabled}
            required={required}
            onFocus={onFocus}
            options={opts?.map(({ value, label }) => ({
              value,
              label,
            }))}
            onChange={
              isMulti
                ? (selected: any): void => setSelected([...selected])
                : (selected: any): void => setSelected(selected)
            }
            defaultValue={
              Array.isArray(defaultValue)
                ? defaultValue.map(({ value, label }) => ({
                    value,
                    label,
                  }))
                : defaultValue
            }
          />
        </div>
      </div>
    </div>
  );
}

export default InputSelect;
