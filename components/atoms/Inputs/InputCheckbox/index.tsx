import React from 'react';

// Props tipadas del componente
interface InputCheckBoxProps {
  label: string;
  name: string;
  extraClassNames?: string;
  isChecked?: boolean;
  setIsChecked?: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: any;
  disabled?: boolean;
  required?: boolean;
}

function InputCheckBox({
  label,
  name,
  extraClassNames = '',
  isChecked,
  setIsChecked,
  onChange,
  disabled = false,
  required,
}: InputCheckBoxProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label htmlFor={name} className={`flex items-center ${extraClassNames}`}>
      <input
        type='checkbox'
        className={`border-font h-4 w-4 rounded-sm border-2 ${
          disabled ? 'accent-learUpGrey-500' : 'accent-font'
        }`}
        name={name}
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={disabled}
        required={required}
      />
      <span
        className={`ml-5 text-sm ${
          disabled ? 'text-learUpGrey-500' : 'text-font'
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default InputCheckBox;
