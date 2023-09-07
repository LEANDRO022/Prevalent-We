import React, { useState } from 'react';

// Importacion de componentes customizados
import InputSelectForm from '@components/atoms/Inputs/InputSelectForm';
import InputText from '@components/atoms/Inputs/InputText';
import InputCheckBox from '@components/atoms/Inputs/InputCheckbox';
import InputPhone from '@components/atoms/Inputs/InputPhone';
import Button from '@components/atoms/Buttons/Button';

import useFormData from 'hooks/useFormData';

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  return {
    props: {
      id,
    },
  };
}

function CreateEditarUserId() {
  const { form, formData, updateFormData } = useFormData({});
  const [roles, setRoles] = useState([]);
  const [roleSelect, setRoleSelect] = useState('');
  const [countries, setCountries] = useState([]);
  const [countrySelect, setCountrySelect] = useState('');
  const [states, setStates] = useState([]);
  const [stateSelect, setStateSelect] = useState('');
  const [cities, setCities] = useState([]);
  const [citySelect, setCitySelect] = useState('');
  const [companies, setCompanies] = useState([]);
  const [companySelect, setCompanySelect] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    formData.role = roleSelect;
    setRoles(formData);
    setCities(formData);
    setStates(formData);
    setCountries(formData);
    setCompanies(formData);
  };

  return (
    <div className='page'>
      <form ref={form} onChange={updateFormData} onSubmit={handleSubmit}>
        {/** Rejilla principal -- 3 Columnas */}
        <div className='grid grid-cols-1 lg:grid-cols-3 justify-center lg:justify-between gap-x-[10%] gap-y-5 lg:mt-10'>
          {/** Columna 1 */}
          <div className='space-y-4'>
            <div>
              <InputSelectForm
                text='Role'
                onChange={setRoleSelect}
                value={roleSelect}
                opts={roles}
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
              <InputSelectForm
                text='Company'
                onChange={setCompanySelect}
                value={companySelect}
                opts={companies}
                placeholder='Company'
              />
            </div>
            <div>
              <InputCheckBox
                label='Active/Inactive'
                name='state'
                isChecked={false}
                setIsChecked={undefined}
              />
            </div>
          </div>
          {/** Columna 2 */}
          <div className='space-y-4'>
            <div>
              <InputPhone label='Phone' name='phone' placeholder='Phone' />
            </div>
            <div>
              <InputSelectForm
                text='Country'
                onChange={setCountrySelect}
                value={countrySelect}
                opts={countries}
                placeholder='Country'
              />
            </div>
            <div>
              <InputSelectForm
                text='State'
                onChange={setStateSelect}
                value={stateSelect}
                opts={states}
                placeholder='State'
              />
            </div>
            <div>
              <InputSelectForm
                text='City'
                onChange={setCitySelect}
                value={citySelect}
                opts={cities}
                placeholder='City'
              />
            </div>
            <div>
              <InputText
                label='First Name'
                name='firstName2'
                placeholder='First Name'
              />
            </div>
            <div>
              <InputText
                label='First Name'
                name='firstName'
                placeholder='First Name'
              />
            </div>
          </div>
          {/** Columna 3 */}
          <div className='space-y-4'>
            <div>
              <InputText label='Site #' name='site' placeholder='Site' />
            </div>
            <div>
              <InputText
                label='Project name'
                name='projectName'
                placeholder='Project name'
              />
            </div>
            <div>
              <InputText label='Adress' name='adress' placeholder='Adress' />
            </div>
          </div>
        </div>
        <div className='mx-auto mt-10 flex gap-8 w-4/5 items-center justify-center'>
          <Button text='Cancel' type='button' priority='secondary' />
          <Button text='Save' type='submit' priority='primary' />
        </div>
      </form>
    </div>
  );
}

export default CreateEditarUserId;
