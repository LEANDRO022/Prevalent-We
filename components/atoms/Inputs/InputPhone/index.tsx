import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Estilos básicos proporcionados por el paquete

// Props del componente tipado
interface InputPhoneProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: any;
  defaultValue?: any;
  onChange?: any;
  disabled?: boolean;
  required?: boolean;
}

function InputPhone({
  label,
  name,
  placeholder,
  value,
  defaultValue = '',
  onChange = () => {},
  disabled,
  required,
}: InputPhoneProps) {
  return (
    <label
      htmlFor={name}
      className='text-sm space-y-1 font-fontPrimaryRegular font-bold'
    >
      <span>
        {label}
        {required && <span className='ml-1 font-bold text-colorCyan'>*</span>}
      </span>
      {/** Cargando la entrada con valores por defecto */}
      <div>
        <PhoneInput
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className='border-black placeholder:text-grey placeholder:font-fontPrimaryRegular font-fontPrimaryRegular font-light h-11 w-full max-w-[30rem] rounded-md border px-3 text-sm placeholder:text-[13px] focus:outline-none'
        />
      </div>
    </label>
  );
}

export default InputPhone;
