import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Icon from '@components/atoms/Icon';
import Title from '@components/atoms/Title';
import React, { SetStateAction, useEffect, useState } from 'react';

// Props tipadas del componente
interface CommentsModalProps {
  openCommentsModal: boolean;
  setOpenCommentsModal: React.Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}

function CommentsModal({
  openCommentsModal,
  setOpenCommentsModal,
  children,
}: CommentsModalProps) {
  const [isClickCaptureClose, setIsClickCaptureClose] = useState(false);

  const onClickCaptureClose = () => {
    setIsClickCaptureClose(true);
  };

  useEffect(() => {
    if (isClickCaptureClose) {
      setOpenCommentsModal(false);
      setIsClickCaptureClose(false);
    }
  }, [isClickCaptureClose, setOpenCommentsModal]);

  return (
    <div onClickCapture={onClickCaptureClose}>
      {openCommentsModal && (
        <div className='wrapper_comments'>
          <div
            className='modal_comments'
            onClickCapture={() => setIsClickCaptureClose(false)}
          >
            <div className='modal_comments__container'>
              <header className='comments_container__head'>
                <div className='flex items-center gap-x-3 h-full'>
                  <Icon iconCategory='ant-design' iconName='comment-outlined' />
                  <Title text='Comments' extraClassNames='comments__title' />
                </div>
                <ButtonIcon
                  type='button'
                  iconCategory='ic'
                  iconName='round-close'
                  onClick={() => setOpenCommentsModal(!openCommentsModal)}
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

export default CommentsModal;
