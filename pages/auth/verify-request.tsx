import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
const VerifyRequest = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center text-center'>
      <div className='w-96 flex flex-col items-center'>
        <Image src='/img/Logo-GDM.png' width={196} height={87} />
        <div>Te hemos enviado un email con el link a tu inicio de sesión.</div>
        <Link href='/'>
          <div className='cursor-pointer my-6 w-56 bg-bluegdm rounded-md p-2 text-white shadow-lg hover:bg-bluegdm_hover'>
            Regresar a Gente DeMente
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VerifyRequest;
