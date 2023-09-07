import React from 'react';
import ReactLoading from 'react-loading';

// Props del componente tipado
interface ButtonProps {
  text: string;
  type: 'button' | 'submit' | 'reset';
  priority: 'primary' | 'secondary';
  extraClassName?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  loadingColor?: string;
  disabled?: boolean;
}

function Button({
  text,
  type = 'button',
  priority = 'primary',
  extraClassName = '',
  children,
  onClick,
  loading = false,
  loadingColor = '#FFFFFF',
  disabled = false,
}: ButtonProps) {
  const buttonPriority = () => {
    if (priority === 'primary') {
      return `button ${disabled ? 'button__disabled' : 'button'}`;
    }
    if (priority === 'secondary') {
      return ` button ${disabled ? 'button__disabled' : 'button__secondary'}`;
    }

    return '';
  };

  const classNameButton = `${buttonPriority()} ${extraClassName}`;
  return (
    <button
      type={type === 'button' ? 'button' : 'submit'}
      className={classNameButton}
      onClick={onClick}
      disabled={disabled}
    >
      <div className='button__container'>
        {loading && (
          <ReactLoading
            type='spin'
            height={24}
            width={24}
            color={loadingColor}
          />
        )}
        {children}
        {text}
      </div>
    </button>
  );
}

export default Button;
