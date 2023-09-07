import React from 'react';
import Image from 'next/image';

// Props tipadas del componente
interface AvatarProps {
  src: string;
  alt: string;
  extraClassName?: string;
}

function Avatar({ src, alt, extraClassName }: AvatarProps) {
  // Por default poner dos letras
  const initials = alt ? alt.substring(0, 2) : 'UP';
  return (
    <div className={`avatar ${extraClassName}`}>
      {src ? (
        <Image src={src} alt={alt} className='avatar__image' />
      ) : (
        <h1 className='avatar__text'>{initials}</h1>
      )}
    </div>
  );
}

export default Avatar;
