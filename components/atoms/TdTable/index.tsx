import React from 'react';

// Props tipadas del componente
interface TdTableProps {
  extraClassName?: string;
  children?: React.ReactNode;
}

// Component that loads the items of the table header
function TdTable({ children, extraClassName = '' }: TdTableProps) {
  return (
    <td
      className={`font-fontPrimaryLight py-3 px-5 text-xs normal-case md:text-sm border-b ${extraClassName}`}
    >
      {children}
    </td>
  );
}

export default TdTable;
