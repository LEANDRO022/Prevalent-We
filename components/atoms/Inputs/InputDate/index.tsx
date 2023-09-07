import React from 'react';

// Props tipadas del componente
interface DateInputFormProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  isDisabled?: boolean;
  required?: boolean;
}

function DateInputForm({
  label,
  value = '',
  onChange = () => {},
  isDisabled = false,
  required = false,
}: DateInputFormProps) {
  return (
    <div className='text-sm space-y-1 font-fontPrimaryRegular font-bold'>
      <label className='font-fontPrimaryRegular font-bold text-sm'>
        {label}
        {required && <span className='ml-1 font-bold text-colorCyan'> * </span>}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        className='w-11/12 p-2 border border-black rounded focus:outline-none focus:border-blue-500 lg:w-full'
      />
    </div>
  );
}

export default DateInputForm;
