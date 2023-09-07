/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

// Importacin de utilidades
import { dataHeaderTableUser } from 'utils/generalConst';

// Importacion de componentes customizados
import ModalFilterUser from '@components/organisms/Modals/FilterUserModal';
import HeaderPage from '@components/organisms/HeaderPage';
import Table from '@components/molecules/Table';
import TdTable from '@components/atoms/TdTable';
import InputCheckBox from '@components/atoms/Inputs/InputCheckbox';
import ButtonIcon from '@components/atoms/Buttons/ButtonIcon';
import Loading from '@components/atoms/Loading';
import { useRouter } from 'next/router';

function MasterUsers() {
  const [openFilterUser, setOpenFilterUser] = useState(false);
  const [usersMasterData, setUsersMasterData] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const router = useRouter();
  const [usersCount, setUsersCount] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [filter, setFilter] = useState({} as any);

  return (
    <>
      <ModalFilterUser open={openFilterUser} setOpen={setOpenFilterUser} />
      <div className='h-full'>
        {/** Encabezado de la pagina */}
        <HeaderPage
          titleMaster='Master users'
          countMaster={usersCount}
          master='users'
          linkMaster='master-users/new'
        >
          {/** Children open modal */}
          <div className='button_icon__color'>
            <ButtonIcon
              type='button'
              iconCategory='lucide'
              iconName='filter'
              onClick={() => setOpenFilterUser(!openFilterUser)}
            />
          </div>
        </HeaderPage>
        {/** Tabla de la pagina */}
        <div className='relative h-[75%]'>
          <Table dataThead={dataHeaderTableUser}>
            {loadingSearch && <Loading open />}
            {!loadingSearch &&
              usersMasterData?.map(user => (
                <tr key={user?.id}>
                  <TdTable>{user?.role?.name}</TdTable>
                  <TdTable>{user?.firstName}</TdTable>
                  <TdTable>{user?.lastName}</TdTable>
                  <TdTable>{user?.email}</TdTable>
                  <TdTable>{user?.company?.name}</TdTable>
                  <TdTable>
                    <InputCheckBox
                      label=''
                      name=''
                      isChecked={user?.enabled}
                      setIsChecked={undefined}
                    />
                  </TdTable>
                  <TdTable>
                    <InputCheckBox
                      label=''
                      name=''
                      isChecked={user?.deleted}
                      setIsChecked={undefined}
                    />
                  </TdTable>
                  <TdTable>
                    <ButtonIcon
                      type='button'
                      iconCategory='material-symbols'
                      iconName='delete-outline-rounded'
                      extraclassName='master_user__icon'
                      onClick={() => {
                        router.push(`/admin/masters/master-users/${user?.id}`);
                      }}
                    />
                  </TdTable>
                </tr>
              ))}
          </Table>
        </div>
      </div>
    </>
  );
}

export default MasterUsers;
