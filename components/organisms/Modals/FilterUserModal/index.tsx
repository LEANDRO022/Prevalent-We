import React, { SetStateAction } from 'react';

// Importacion de componentes customizados
import Modal from '@components/molecules/Modal';
import Icon from '@components/atoms/Icon';
import Text from '@components/atoms/Text';
import InputSelectForm from '@components/atoms/Inputs/InputSelectForm';
import InputText from '@components/atoms/Inputs/InputText';
import Button from '@components/atoms/Buttons/Button';

// Props tipadas del componente
interface FilterUserModalProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

function FilterUserModal({ open, setOpen }: FilterUserModalProps) {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div>
        {/** Container encabezado */}
        <div className='modal__header'>
          <Icon
            iconCategory='lucide'
            iconName='filter'
            extraclassName='modal__icon modal__icon_filter'
          />
          <Text
            text='Type the items you want to filter'
            extraClassNames='modal__text'
          />
        </div>
        {/** Container inputs filter */}
        <div className='modal__main'>
          <div>
            <InputSelectForm
              text='Role'
              opts={[
                {
                  label: 'Opcion 1',
                  value: '1',
                },
                {
                  label: 'Opcion 2',
                  value: '2',
                },
                {
                  label: 'Opcion 3',
                  value: '3',
                },
              ]}
              placeholder='Role'
            />
          </div>
          <div>
            <InputText
              label='First Name'
              name='firstName'
              placeholder='First Name'
            />
          </div>
          <div>
            <InputText
              label='Last Name'
              name='lastName'
              placeholder='Last name'
            />
          </div>
          <div>
            <InputText label='Email' name='email' placeholder='Email' />
          </div>
          <div>
            <InputText label='Company' name='company' placeholder='Company' />
          </div>
          <div>
            <InputText
              label='Title / position'
              name='titlePosition'
              placeholder='Title / position'
            />
          </div>
          <div>
            <InputText label='Adress' name='adress' placeholder='Adress' />
          </div>
        </div>
        {/** Container button */}
        <div className='modal__button'>
          <Button text='Cancel' type='button' priority='secondary' />
          <Button text='Filter' type='button' priority='primary' />
        </div>
      </div>
    </Modal>
  );
}

export default FilterUserModal;
