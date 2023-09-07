import React, { createContext, useContext } from 'react';

interface SidebarContextType {
  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  openSidebarMobile: boolean;
  setOpenSidebarMobile: React.Dispatch<React.SetStateAction<boolean>>;
  expandSidebar: boolean;
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextType>({
  isMobile: false,
  setIsMobile: () => {},
  openSidebarMobile: false,
  setOpenSidebarMobile: () => {},
  expandSidebar: false,
  setExpandSidebar: () => {},
});

export function useIsMobile() {
  return useContext(SidebarContext);
}
