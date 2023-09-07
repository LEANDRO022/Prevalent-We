import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import useInterval from 'hooks/useInterval';
import Image from 'next/image';

const Loading = () => {
  const [img, setImg] = useState('/img/Favicon.png');

  useInterval(() => {
    if (img === '/img/Favicon.png') {
      setImg('/img/LogoAzul.png');
    } else {
      setImg('/img/Favicon.png');
    }
  }, 500);

  return (
    <>
      <div className='absolute z-40 bg-gray-300  w-full h-full'>
        <div className='flex justify-center items-center h-full'>
          <Image className='z-1  ' src={img} height={70} width={70} />
        </div>
      </div>
    </>
  );
};
const MiniLoading = () => {
  const [img, setImg] = useState('/img/Favicon.png');

  useInterval(() => {
    if (img === '/img/Favicon.png') {
      setImg('/img/LogoAzul.png');
    } else {
      setImg('/img/Favicon.png');
    }
  }, 500);

  return (
    <>
      <div className='flex justify-center items-center'>
        <Image className='z-1  ' src={img} height={70} width={70} />
      </div>
    </>
  );
};

export { MiniLoading };

export default Loading;
