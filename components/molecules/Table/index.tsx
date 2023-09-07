import React from 'react';

// Importacion de componentes customizados
import ThTable from '@components/atoms/ThTable';

// Props tipadas del componente
interface TableProps {
  dataThead: string[];
  children?: React.ReactNode;
}

function Table({ dataThead, children }: TableProps) {
  return (
    <div className='h-full overflow-y-auto overflow-x-auto'>
      <table className='min-w-full border-collapse table-fixed'>
        <thead className='sticky top-0 right-0 border-b-2 shadow-md border-colorCyan'>
          <tr>
            {dataThead.map(item => (
              <ThTable name={item} key={item} />
            ))}
          </tr>
        </thead>
        {/** Table information mapping */}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default Table;
