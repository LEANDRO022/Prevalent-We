import React from 'react';

// Props tipadas del componente
interface ThTableProps {
  name?: string;
  extraClassName?: string;
}

// Component that loads the items of the table header
function ThTable({ name, extraClassName = '' }: ThTableProps) {
  return (
    <th
      className={`font-fontPrimaryBold border-collapse whitespace-nowrap bg-emerald-100 py-4 px-5 text-start align-baseline normal-case ${extraClassName}`}
    >
      {name}
    </th>
  );
}

export default ThTable;
