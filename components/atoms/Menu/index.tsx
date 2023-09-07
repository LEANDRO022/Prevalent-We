import React, { SetStateAction, useState, useEffect } from 'react';

// Props tipadas del componente
interface MenuProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}

function Menu({ open, setOpen, children }: MenuProps) {
  // Captura del clic
  const [isClickCaptureClose, setIsClickCaptureClose] = useState<boolean>(
    false
  );

  const onClickCaptureClose = () => {
    setIsClickCaptureClose(true);
  };

  useEffect(() => {
    if (isClickCaptureClose) {
      setOpen(false);
      setIsClickCaptureClose(false);
    }
  }, [isClickCaptureClose]);

  return (
    <div onClickCapture={onClickCaptureClose}>
      {open && (
        <div className='fixed inset-0 z-50 overflow-hidden'>
          <div className='relative'>{children}</div>
        </div>
      )}
    </div>
  );
}

export default Menu;
