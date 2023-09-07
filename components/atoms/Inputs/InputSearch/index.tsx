import React from 'react';

// Props tipadas del componente
interface InputSearchProps {
  label?: string;
  name: string;
  placeholder: string;
  extraClassName?: string;
  value?: string | number;
  defaultValue?: any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
}

function InputSearch({
  label,
  name,
  placeholder,
  extraClassName,
  value,
  defaultValue,
  onChange,
  onClick,
  onKeyDown,
  required = false,
  disabled = false,
}: InputSearchProps) {
  // Buscar texto mediante pulsado de tecla enter
  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <label htmlFor={name}>
      <span>
        {label}
        {required && <span className='input_search__label'>*</span>}
      </span>
      <div className='input_search__container'>
        <input
          type='search'
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input_search ${extraClassName}`}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          defaultValue={defaultValue}
          onClick={onClick}
        />
      </div>
    </label>
  );
}

export default InputSearch;
