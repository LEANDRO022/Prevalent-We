import React from 'react';

// Props tipadas del componente
interface ProgressBarProps {
  percentage: string;
}

function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className='h-[5px] rounded bg-colorCyan500/10 overflow-hidden w-full'>
      <div
        className='bg-colorCyan500 h-full transition-width duration-500'
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressBar;
