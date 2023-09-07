import useFormData from 'hooks/useFormData';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Fade from '@material-ui/core/Fade';
import React, { useState, useEffect } from 'react';
import router, { useRouter } from 'next/router';
import Loading from '@components/Loading';
import {
  CVInputPageContainer,
  CVInputPageHeader,
  CVInputPageFooter,
  CVInputPageContent,
  Pregunta,
  Seccion,
  InputContainer,
  CustomCheckbox,
} from 'components/InputPage';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.75rem',
    padding: '8px',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const EDITAR_NAME = gql`
  mutation updateUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
    }
  }
`;

export default function UserModal({ userId }) {
  const [form, getFormData] = useFormData(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [name, setName] = useState('');
  const router = useRouter();
  const [mutation, { loading: mutationLoading, error: mutationError }] = useMutation(EDITAR_NAME);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const submitData = async (e) => {
    e.preventDefault();
    //Mutación de actualización de perfil
    setLoading(true);
    const where = {
      id: userId,
    };
    let data = getFormData();
    let data1 = {};
    if (data.name !== '') {
      data1 = { name: { set: data.name } };
    }
    mutation({
      variables: { where, data: data1 },
    })
      .then(({ data }) => {
        setLoading(false);
        // console.log(data);
        setOpen(false);
        // refetch();
        router.reload();
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  };

  if (loading) return <Loading />;
  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className='rounded-xl'>
            <form ref={form} onSubmit={submitData}>
              <div className='bg-white flex flex-col items-center text-center'>
                <h1 className='font-bold text-gray-500 text-3xl  p-4 font-sans rounded-xl'>
                  En Gente DeMente hablamos con nombre propio
                  <br />
                  <span className='my-2 text-2xl'>¿Nos podrías confirmar el tuyo?</span>
                </h1>
                <div className='flex flex-col w-64'>
                  <div className='bg-white border-none my-5'>
                    <InputContainer>
                      <span className='my-1 mx-5 font-semibold text-gray-600'>
                        Nombre<span className='text-red-500'> *</span>
                      </span>
                      <input
                        className='my-1 input mx-5 '
                        type='text'
                        id='name'
                        name='name'
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </InputContainer>
                  </div>
                  <button
                    type='submit'
                    className='uppercase cursor-pointer mx-10 my-5 justify-self-center shadow-lg hover:shadow-xl bg-bluegdm hover:bg-bluegdm_hover py-2 px-4 text-sm font-bold text-white rounded-sm'
                  >
                    Guardar
                  </button>
                  {name && name.split(' ').length > 1 && <span className='my-5'>¡Gracias, {name.split(' ')[0]}!</span>}
                </div>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
