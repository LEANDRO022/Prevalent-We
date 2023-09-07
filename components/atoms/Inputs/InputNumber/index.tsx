import React from 'react';
import { NumericFormat } from 'react-number-format';

// Props del componente tipado
interface InputTextProps {
  label: string;
  name: string;
  placeholder?: string;
  extraClassNames?: string;
  value?: any;
  defaultValue?: any;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  children?: React.ReactNode;
  onChange?: any;
  onFocus?: any;
  onBlur?: any;
  onInput?: any;
  required?: boolean;
  disabled?: boolean;
}

function InputNumber({
  label,
  name,
  placeholder,
  extraClassNames = '',
  value,
  defaultValue = '',
  thousandSeparator = true,
  prefix,
  suffix,
  decimalScale = 0,
  fixedDecimalScale = false,
  children,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onInput = () => {},
  required,
  disabled = false,
}: InputTextProps) {
  return (
    <label htmlFor={name}>
      <span>
        {label}
        {required && <span className='ml-1 font-bold text-colorCyan'>*</span>}
      </span>
      <NumericFormat
        name={name}
        placeholder={placeholder}
        className={` ${extraClassNames} ${disabled ? '' : ''}`}
        value={value}
        defaultValue={defaultValue}
        thousandSeparator={thousandSeparator}
        prefix={prefix}
        suffix={suffix}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={onInput}
        required={required}
        disabled={disabled}
        autoComplete='off'
      />
      {children}
    </label>
  );
}

export default InputNumber;
