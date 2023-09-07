import React, { SetStateAction, useState } from 'react';

// Importacion de componentes customizados
import Modal from '@components/molecules/Modal';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import InputSearch from '@components/atoms/Inputs/InputSearch';
import ButtonTab from '@components/atoms/Buttons/ButtonTab';

// Props tipadas del componente
interface WorkspacesModalProps {
  openWorkspacesModal: boolean;
  setOpenWorkspacesModal: React.Dispatch<SetStateAction<boolean>>;
}

// Array de tabs
const tabs = [
  {
    id: 1,
    label: 'Project Management',
  },
  {
    id: 2,
    label: 'Site Management',
  },
  {
    id: 3,
    label: 'Clinical Monitoring',
  },
  {
    id: 4,
    label: 'Meeting Minutes',
  },
];

function WorkspacesModal({
  openWorkspacesModal,
  setOpenWorkspacesModal,
}: WorkspacesModalProps) {
  // Implemen
  const [indiceTabActiva, setIndiceTabActiva] = useState<number>(1);

  // Manejador de captura del id tab
  const handleOpenTab = id => {
    setIndiceTabActiva(id);
  };
  return (
    <Modal
      open={openWorkspacesModal}
      setOpen={setOpenWorkspacesModal}
      extraClassName='workspace_modal'
    >
      <div className='h-screen space-y-5'>
        {/** */}
        <div className='w-full flex gap-x-2'>
          <ButtonIcon
            type='button'
            iconCategory='mdi'
            iconName='order-alphabetical-ascending'
            extraclassName='workspace_modal__button_icon'
          />
          <InputSearch name='searchWorkspace' placeholder='Search' />
        </div>
        {/** */}
        <div className='flex justify-between'>
          {tabs.map(tab => (
            <div key={tab?.id}>
              <ButtonTab
                text={tab?.label}
                activeTab={tab?.id === indiceTabActiva}
                onClick={() => handleOpenTab(tab?.id)}
                extraclassName='button_tab__text workspace_modal__tab_text'
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default WorkspacesModal;
