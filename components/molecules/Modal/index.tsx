import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Title from '@components/atoms/Title';
import React, { SetStateAction, useEffect, useState } from 'react';

// Props tipadas del componente
interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  title?: string;
  extraClassName?: string;
  children?: React.ReactNode;
}

function Modal({ open, setOpen, title, extraClassName, children }: ModalProps) {
  const [isClickCaptureClose, setIsClickCaptureClose] = useState(false);

  const onClickCaptureClose = () => {
    setIsClickCaptureClose(true);
  };

  useEffect(() => {
    if (isClickCaptureClose) {
      setOpen(false);
      setIsClickCaptureClose(false);
    }
  }, [isClickCaptureClose, setOpen]);

  return (
    <div onClickCapture={onClickCaptureClose}>
      {open && (
        <div className='wrapper_modal'>
          <div
            className={`modal ${extraClassName}`}
            onClickCapture={() => setIsClickCaptureClose(false)}
          >
            <div className='modal__container'>
              <header className='modal__container_head'>
                <Title text={title} extraClassNames='modal__title' />
                <ButtonIcon
                  type='button'
                  iconCategory='ic'
                  iconName='round-close'
                  extraclassName='modal__icon'
                  onClick={() => setOpen(false)}
                />
              </header>
              <main>{children}</main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
