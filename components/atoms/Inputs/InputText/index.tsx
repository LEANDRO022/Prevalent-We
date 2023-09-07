import React from 'react';

// Props del componente tipado
interface InputTextProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: any;
  defaultValue?: any;
  onChange?: any;
  disabled?: boolean;
  required?: boolean;
}

function InputText({
  label,
  name,
  placeholder,
  value,
  defaultValue = '',
  onChange = () => {},
  disabled,
  required,
}: InputTextProps) {
  return (
    <label htmlFor={name} className='input__label'>
      <span>
        {label}
        {required && <span className='ml-1 font-bold text-colorCyan'>*</span>}
      </span>
      {/** Cargando la entrada con valores por defecto */}
      <div>
        {defaultValue ? (
          <input
            type='text'
            name={name}
            placeholder={placeholder}
            className={disabled ? 'input input_disabled' : ' input'}
            defaultValue={defaultValue}
            onChange={onChange}
            autoComplete='off'
            disabled={disabled}
            required={required}
          />
        ) : (
          <input
            type='text'
            name={name}
            placeholder={placeholder}
            className={disabled ? 'input input_disabled' : ' input w-full' }
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete='off'
            required={required}
            
          />
        )}
      </div>
    </label>
  );
}

export default InputText;
