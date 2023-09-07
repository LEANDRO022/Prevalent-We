import React from 'react';

// Tipado props del componente
interface CardProps {
  extraClassNames?: string;
  children?: React.ReactNode;
}

function Card({ extraClassNames, children }: CardProps) {
  return (
    <div className={`card ${extraClassNames}`}>
      <div className='card__content'>{children}</div>
    </div>
  );
}

export default Card;
