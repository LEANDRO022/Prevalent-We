import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Importacion de contextos
import { SidebarContext } from 'context/sidebar';

// Importacion de componentes customizados
import Sidebar from '@components/organisms/Sidebar';
import SidebarMobile from '@components/organisms/SidebarMobile';
import Navbar from '@components/organisms/Navbar';
import FooterTab from '@components/organisms/FooterTab';

// Props del componente tipado
interface LayoutPrivateProps {
  children: React.ReactNode;
}

function LayoutPrivate({ children }: LayoutPrivateProps) {
  // Implementacion de estados
  const [isMobile, setIsMobile] = useState(false);
  const [openSidebarMobile, setOpenSidebarMobile] = useState(false);
  const [expandSidebar, setExpandSidebar] = useState<boolean>(false);

  // Función para actualizar el estado de 'isMobile' según el ancho de la ventana
  const handleWindowResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    // Asegúrate de que el sidebar se abra en dispositivos de escritorio al inicio
    setExpandSidebar(isMobile);

    // Asegúrate de que el sidebar esté cerrado en dispositivos móviles al inicio
    setIsMobile(window.innerWidth <= 768);

    // Agrega el evento para manejar el cambio de tamaño de la ventana
    window.addEventListener('resize', handleWindowResize);

    // Elimina el evento al desmontar el componente para evitar fugas de memoria
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Memorizar el objeto que pasas como valor al proveedor del contexto
  const handleSetExpandSidebar = useMemo(
    () => ({
      isMobile,
      setIsMobile,
      openSidebarMobile,
      setOpenSidebarMobile,
      expandSidebar,
      setExpandSidebar,
    }),
    [
      isMobile,
      setIsMobile,
      openSidebarMobile,
      setOpenSidebarMobile,
      expandSidebar,
      setExpandSidebar,
    ]
  );
  return (
    <SidebarContext.Provider value={handleSetExpandSidebar}>
      <div className='relative flex flex-col md:flex-row h-screen overflow-hidden'>
        {/* Sidebar */}
        <div className='h-screen absolute z-50'>
          {!isMobile ? (
            <Sidebar />
          ) : (
            <SidebarMobile
              open={openSidebarMobile}
              setOpen={() => setOpenSidebarMobile(!openSidebarMobile)}
            />
          )}
        </div>
        {/** Container de contenido */}
        <div className='relative flex flex-col w-full h-[100%] md:pl-16'>
          {/* Barra de navegación superior */}
          <div className='sticky top-0 right-0 z-10'>
            <Navbar />
          </div>
          <div className='w-full overflow-y-auto h-[100%]'>
            <div className='w-full h-full'>{children}</div>
          </div>
          {/* Tab footer */}
          <div className='md:hidden'>
            <FooterTab />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
export default LayoutPrivate;
