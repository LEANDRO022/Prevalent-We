import React from 'react';
import Image from 'next/image';

// Props tipadas del componente
interface ImagenProps {
  src: string;
  alt: string;
}

function Imagen({ src, alt }: ImagenProps) {
  return <Image src={src} alt={alt} fill priority objectFit='fill' />;
}

export default Imagen;
