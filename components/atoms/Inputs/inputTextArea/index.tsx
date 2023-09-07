import React, { useMemo } from 'react';

// Props tipadas del componente
interface TextAreaFormProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  required?: boolean;
}

function TextAreaForm({
  label,
  placeholder,
  value = '',
  onChange = () => {},
  isDisabled = false,
  required = false,
}: TextAreaFormProps) {
  return (
    <div className='text-sm space-y-1 font-fontPrimaryRegular font-bold'>
      <label className='font-fontPrimaryRegular font-bold text-sm'>
        {label}
        {required && <span className='ml-1 font-bold text-colorCyan'> * </span>}
      </label>

      <textarea
        placeholder={placeholder}
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        className=' border border-black rounded focus:outline-none focus:border-blue-500 lg:w-full'
      />
    </div>
  );
}

export default TextAreaForm;
